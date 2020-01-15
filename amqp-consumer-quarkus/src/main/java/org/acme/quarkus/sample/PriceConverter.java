package org.acme.quarkus.sample;

import io.smallrye.reactive.messaging.annotations.Broadcast;
import io.vertx.core.json.JsonObject;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Outgoing;
import org.eclipse.microprofile.reactive.messaging.Acknowledgment.Strategy;
import org.eclipse.microprofile.reactive.messaging.Acknowledgment;
import javax.enterprise.context.ApplicationScoped;

/**
 * A bean consuming data from the "rebel-transactions" AMQP queue and applying some
 * conversion. The result is pushed to the "my-data-stream" stream which is an
 * in-memory stream.
 */
@ApplicationScoped
public class PriceConverter {

    // The conversion rate between dollars and imperial credits
    private static final double CONVERSION_RATE = 0.88;

    @Incoming("rebel-transactions")
    @Outgoing("my-data-stream")
    @Acknowledgment(Acknowledgment.Strategy.PRE_PROCESSING)
    @Broadcast
    public String process(String incomingTx) {
        System.out.println("Received transaction: " + incomingTx);

        JsonObject txJson = new JsonObject(incomingTx);

        double txCreditsAmount = txJson.getDouble("amount");
        double txDollarAmount = txCreditsAmount * CONVERSION_RATE;

        txJson.put("dollars", txDollarAmount);

        String outTxJson = txJson.encode();

        System.out.println("Sending out updated transaction: " + outTxJson);

        return outTxJson;
    }

}
