/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.security;

import brave.Span;
import brave.propagation.TraceContext;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class TracerUtils {
    public static brave.Tracer mockTracer() {
        final brave.Tracer tracer = mock(brave.Tracer.class);
        final Span span = mock(Span.class);
        final TraceContext traceCxt = TraceContext.newBuilder()
                .spanId(1)
                .traceId(1)
                .build();
        given(tracer.currentSpan()).willReturn(span);
        given(span.context()).willReturn(traceCxt);
        return tracer;
    }
}
