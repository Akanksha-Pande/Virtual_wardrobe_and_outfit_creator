package com.virtualwardrobe.backend.service.ai;

import ai.onnxruntime.*;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.FloatBuffer;
import java.util.Map;

@Service
public class OnnxService {

    private OrtEnvironment env;
    private OrtSession session;

    @PostConstruct
    public void init() {
        try {
            System.out.println("Initializing ONNX Service...");

            env = OrtEnvironment.getEnvironment();

            // Load model from resources
            InputStream modelStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("models/outfit_suggester.onnx");

            if (modelStream == null) {
                throw new IllegalStateException(
                        "Model not found in resources/models/outfit_suggester.onnx"
                );
            }

            // Copy to temp file (mandatory on Windows)
            File tempFile = File.createTempFile("outfit_suggester", ".onnx");
            tempFile.deleteOnExit();

            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                modelStream.transferTo(fos);
            }

            System.out.println("ONNX model copied to: " + tempFile.getAbsolutePath());

            OrtSession.SessionOptions options = new OrtSession.SessionOptions();
            options.setOptimizationLevel(OrtSession.SessionOptions.OptLevel.ALL_OPT);

            try {
                session = env.createSession(tempFile.getAbsolutePath(), options);
            } catch (Exception ex) {
                System.err.println("ONNX Session creation failed!");
                ex.printStackTrace();

                System.out.println("Switching AI to FALLBACK MODE.");
                session = null;   // Prevent application crash
                return;
            }

            System.out.println("ONNX model loaded successfully!");

        } catch (Exception e) {
            System.err.println("ONNX initialization failed");
            e.printStackTrace();
            session = null; // Disable AI but keep app running
        }
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (session != null) session.close();
            if (env != null) env.close();
        } catch (Exception ignored) {}
    }

    public float[] runModel(float[] inputData, long[] inputShape) throws Exception {

        if (session == null) {
            System.out.println("ONNX unavailable → using fallback predictions");
            return new float[]{0.42f};
        }

        String inputName = session.getInputNames().iterator().next();

        FloatBuffer fb = FloatBuffer.wrap(inputData);
        try (OnnxTensor inputTensor = OnnxTensor.createTensor(env, fb, inputShape)) {

            Map<String, OnnxTensor> inputs = Map.of(inputName, inputTensor);

            try (OrtSession.Result results = session.run(inputs)) {
                Object output = results.get(0).getValue();

                if (output instanceof float[] arr) return arr;
                if (output instanceof float[][] arr) return arr[0];
            }
        }

        throw new RuntimeException("Unexpected ONNX output format");
    }
}
