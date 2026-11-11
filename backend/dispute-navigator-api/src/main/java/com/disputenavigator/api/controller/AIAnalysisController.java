
package com.disputenavigator.api.controller;

import com.disputenavigator.api.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:4200")
public class AIAnalysisController {

    private final GeminiService geminiService;

    public AIAnalysisController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public Map<String, String> analyzeDispute(
            @RequestBody Map<String, String> request) {

        String reason = request.get("disputeReason");
        String transaction = request.get("transactionDescription");
        String explanation = request.get("merchantExplanation");

        if (reason == null || reason.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dispute reason is required."
            );
        }

        if (transaction == null || transaction.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Transaction description is required."
            );
        }

        if (explanation == null || explanation.isBlank()) {
            explanation = "No additional explanation provided.";
        }

        try {
            String analysis = geminiService.analyzeDispute(
                    reason,
                    transaction,
                    explanation
            );

            return Map.of("analysis", analysis);

        } catch (Exception exception) {
            exception.printStackTrace();

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to analyse the dispute. Please try again."
            );
        }
    }
}
