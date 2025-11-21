import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import onnx
import torch.onnx

# --------------------------
# Load dataset (CSV)
# --------------------------
df = pd.read_csv('clothing_items.csv', header=None, names=[
    'id', 'category', 'colour', 'image_url', 'brand', 'season', 'description', 'outfit_id'
])

# --------------------------
# Encode features
# --------------------------
# Category and Season → One-hot
category_encoder = OneHotEncoder(sparse_output=False)
season_encoder = OneHotEncoder(sparse_output=False)

category_ohe = category_encoder.fit_transform(df[['category']])
season_ohe = season_encoder.fit_transform(df[['season']])

# Colour - RGB mapping (simple dictionary)
color_map = {
    'black': [0,0,0], 'white':[1,1,1], 'red':[1,0,0], 'green':[0,1,0], 'blue':[0,0,1],
    'purple':[0.5,0,0.5], 'yellow':[1,1,0], 'orange':[1,0.5,0], 'pink':[1,0.75,0.8],
    # add more colors as needed
}
color_vec = np.array([color_map.get(c.lower(), [0.5,0.5,0.5]) for c in df['colour']])

# Concatenate all features
features = np.hstack([category_ohe, season_ohe, color_vec])

# Map IDs to index for later retrieval
id_to_index = {cid:i for i,cid in enumerate(df['id'])}

# --------------------------
# Prepare training data
# --------------------------
# Group by outfit_id and prepare (input: previous items, output: top & bottom)
outfit_groups = df.groupby('outfit_id')
X, y = [], []

for outfit_id, group in outfit_groups:
    items = features[[id_to_index[cid] for cid in group['id']]]
    # input: average of all items in outfit
    input_vec = items.mean(axis=0)
    # output: find top & bottom vectors
    top_vec = items[group['category']=='tops'].mean(axis=0) if any(group['category']=='tops') else np.zeros(items.shape[1])
    bottom_vec = items[group['category']=='bottoms'].mean(axis=0) if any(group['category']=='bottoms') else np.zeros(items.shape[1])
    output_vec = np.concatenate([top_vec, bottom_vec])
    X.append(input_vec)
    y.append(output_vec)

X = np.array(X, dtype=np.float32)
y = np.array(y, dtype=np.float32)

# --------------------------
# PyTorch Dataset
# --------------------------
class OutfitDataset(torch.utils.data.Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32)
    def __len__(self):
        return len(self.X)
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

dataset = OutfitDataset(X, y)
dataloader = torch.utils.data.DataLoader(dataset, batch_size=8, shuffle=True)

# --------------------------
# Define MLP Model
# --------------------------
input_dim = X.shape[1]
output_dim = y.shape[1]

class OutfitMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, output_dim),
            nn.Sigmoid()
        )
    def forward(self, x):
        return self.model(x)

model = OutfitMLP()
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# --------------------------
# Train the model
# --------------------------
epochs = 100
for epoch in range(epochs):
    total_loss = 0
    for xb, yb in dataloader:
        optimizer.zero_grad()
        out = model(xb)
        loss = criterion(out, yb)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    if (epoch+1)%20==0:
        print(f"Epoch {epoch+1}, Loss: {total_loss/len(dataloader):.4f}")

# --------------------------
# Export to ONNX
# --------------------------
dummy_input = torch.randn(1, input_dim)
torch.onnx.export(
    model,
    dummy_input,
    "outfit_suggester.onnx",
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={'input': {0:'batch_size'}, 'output': {0:'batch_size'}}
)
print("outfit_suggester.onnx saved!")

# ------------------------------------------------------
# Function to map predicted vector to closest real items
# ------------------------------------------------------
def recommend_items(pred_vector, df_features=features, df_ids=df['id'].values):
    n = df_features.shape[1]  # single item feature length
    top_vec = pred_vector[:n].reshape(1,-1)
    bottom_vec = pred_vector[n:].reshape(1,-1)

    # Compute cosine similarity
    sims = cosine_similarity(df_features, top_vec)
    top_index = sims.argmax()
    sims = cosine_similarity(df_features, bottom_vec)
    bottom_index = sims.argmax()

    top_item = df_ids[top_index]
    bottom_item = df_ids[bottom_index]
    return top_item, bottom_item

# Example usage
with torch.no_grad():
    sample_input = torch.tensor([X[0]], dtype=torch.float32)
    pred = model(sample_input).numpy()[0]
    top_item_id, bottom_item_id = recommend_items(pred)
    print("Recommended Top ID:", top_item_id)
    print("Recommended Bottom ID:", bottom_item_id)
