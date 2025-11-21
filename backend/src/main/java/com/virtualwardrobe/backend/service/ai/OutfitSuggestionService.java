package com.virtualwardrobe.backend.service.ai;

import com.virtualwardrobe.backend.model.ClothingItem;
import com.virtualwardrobe.backend.repository.ClothingItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OutfitSuggestionService {

    private final OnnxService onnxService;
    private final ClothingItemRepository clothingItemRepository;

    public List<ClothingItem> suggestOutfit(UUID userId) {
        try {
            float[] input = new float[]{0.3f, 0.7f, 0.2f, 0.9f};
            long[] shape = new long[]{1, input.length};

            float[] predictions = onnxService.runModel(input, shape);

            System.out.println("AI predictions: " + Arrays.toString(predictions));

            if (predictions == null || predictions.length == 0) {
                predictions = new float[]{0.1f};
            }

            List<ClothingItem> allItems = clothingItemRepository.findAllByUserId(userId);

            Map<String, List<ClothingItem>> categorized = new HashMap<>();
            allItems.forEach(item ->
                    categorized.computeIfAbsent(item.getCategory(), k -> new ArrayList<>()).add(item)
            );

            List<String> categories = List.of("outerwear", "tops", "bottoms", "shoes", "accessories");

            List<ClothingItem> outfit = new ArrayList<>();

            Random random = new Random(
                    (long) (predictions[0] * 10000)
            );

            for (String category : categories) {
                List<ClothingItem> group = categorized.getOrDefault(category, List.of());
                if (!group.isEmpty()) {
                    outfit.add(group.get(random.nextInt(group.size())));
                }
            }

            return outfit;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
