
package com.disputenavigator.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class GeminiService {

    private final RestClient restClient;

    @Value("${ollama.model}")
    private String model;

    public GeminiService(
            @Value("${ollama.base-url}") String baseUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String analyzeDispute(
            String disputeReason,
            String transactionDescription,
            String merchantExplanation) {

        String prompt = """
                You are Dispute Navigator, an AI assistant
                that helps merchants understand payment disputes.

                Analyse the following dispute information.

                DISPUTE REASON:
                %s

                TRANSACTION DESCRIPTION:
                %s

                MERCHANT EXPLANATION:
                %s

                Prepare your response using these sections:

                1. DISPUTE EXPLANATION
                Explain the dispute in simple language.

                2. WHAT THE MERCHANT NEEDS TO ESTABLISH
                Explain the important facts the merchant may
                need to demonstrate.

                3. RECOMMENDED EVIDENCE
                Give a practical evidence checklist and explain
                why each item may be useful.

                4. POTENTIAL GAPS
                Identify missing or unclear information.

                5. RECOMMENDED NEXT STEPS
                Give practical actions the merchant can take.

                Important rules:
                - Never invent transaction details or evidence.
                - Separate known facts from assumptions.
                - Never guarantee a successful dispute outcome.
                - Do not make decisions on PayPal's behalf.
                - Treat merchant-provided details as unverified.
                - Ask the merchant to verify actual PayPal
                  requirements and deadlines in their account.
                - Keep the response clear and practical.
                """.formatted(
                disputeReason,
                transactionDescription,
                merchantExplanation
        );

        Map<String, Object> options = Map.of(
        "num_predict", 350,
        "num_ctx", 2048,
        "temperature", 0.2
);

Map<String, Object> requestBody = Map.of(
        "model", model,
        "prompt", prompt,
        "stream", false,
        "keep_alive", "30m",
        "options", options
);

        Map<?, ?> response = restClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null || response.get("response") == null) {
            throw new IllegalStateException(
                    "Ollama returned an empty response."
            );
        }

        return response.get("response").toString();
    }
}
