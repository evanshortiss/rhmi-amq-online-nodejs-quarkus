package org.acme.quarkus.sample;

import io.smallrye.reactive.messaging.annotations.Broadcast;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Outgoing;
import java.io.IOException;
import javax.enterprise.context.ApplicationScoped;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * A bean consuming data from the "transactions" AMQP queue and applying some
 * conversion. The result is pushed to the "my-data-stream" stream which is an
 * in-memory stream.
 */
@ApplicationScoped
public class PriceConverter {

    // The conversion rate between dollars and imperial credits
    private static final double CONVERSION_RATE = 0.88;

    @Incoming("rebel-transactions")
    @Outgoing("my-data-stream")
    @Broadcast
    public String process(String incomingTx) {
        ObjectMapper om = new ObjectMapper();

        try {
            // Parse object and perform currency conversion
            System.out.println("Received transaction: " + incomingTx);
            RebelTransaction tx = om.readValue(incomingTx, RebelTransaction.class);
            tx.dollars = tx.credits * CONVERSION_RATE;
            System.out.println(tx.character);
            System.out.println(tx.credits);
            System.out.println(tx.dollars);
            System.out.println(tx.timestamp);
            // Write out the updated Object
            return om.writeValueAsString(tx);
        } catch (IOException ex) {
            // Log and return an error
            System.out.println("An exception occurred:");
            System.out.println(ex.getMessage());

            return "Error processing transaction";
        }
    }

}
