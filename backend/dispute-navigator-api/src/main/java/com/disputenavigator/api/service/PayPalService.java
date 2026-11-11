
package com.disputenavigator.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import tools.jackson.databind.JsonNode;

@Service
public class PayPalService {

    private final RestClient restClient;

    @Value("${paypal.base-url}")
    private String baseUrl;

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    public PayPalService() {
        this.restClient = RestClient.create();
    }

    private String getAccessToken() {

        MultiValueMap<String, String> form =
                new LinkedMultiValueMap<>();

        form.add("grant_type", "client_credentials");

        JsonNode response = restClient.post()
                .uri(baseUrl + "/v1/oauth2/token")
                .headers(headers ->
                        headers.setBasicAuth(clientId, clientSecret))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(JsonNode.class);

        if (response == null ||
                response.get("access_token") == null) {
            throw new IllegalStateException(
                    "PayPal did not return an access token");
        }

        return response.get("access_token").asText();
    }

    public JsonNode getDisputes() {

        String accessToken = getAccessToken();

        return restClient.get()
                .uri(baseUrl + "/v1/customer/disputes")
                .headers(headers ->
                        headers.setBearerAuth(accessToken))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode getDisputeById(String disputeId) {

        String accessToken = getAccessToken();

        return restClient.get()
                .uri(baseUrl + "/v1/customer/disputes/" + disputeId)
                .headers(headers ->
                        headers.setBearerAuth(accessToken))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(JsonNode.class);
    }
}
