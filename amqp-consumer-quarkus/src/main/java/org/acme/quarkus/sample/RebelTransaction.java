package org.acme.quarkus.sample;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class RebelTransaction {

    @JsonProperty("amount")
    public double credits;
    @JsonProperty("character")
    public String character;
    @JsonProperty("timestamp")
    public String timestamp;
    @JsonProperty("dollars")
    public double dollars;

    public RebelTransaction() {}

    public RebelTransaction(double credits, String character, String timestamp) {
        this.credits = credits;
        this.character = character;
        this.timestamp = timestamp;
    }
}
