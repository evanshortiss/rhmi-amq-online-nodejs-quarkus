package org.acme.quarkus.sample;

import io.quarkus.security.Authenticated;
import io.smallrye.reactive.messaging.annotations.Channel;
import org.reactivestreams.Publisher;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * A simple resource retrieving the in-memory "my-data-stream" and sending the items to a server sent event.
 */
@Path("/prices")
@Authenticated
public class RebelTransactionResource {

    @Inject
    @Channel("my-data-stream") Publisher<String> transactions;

    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public Publisher<String> stream() {
        return transactions;
    }
}
