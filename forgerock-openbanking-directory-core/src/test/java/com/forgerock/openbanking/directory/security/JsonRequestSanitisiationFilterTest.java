/**
 * Copyright 2019 ForgeRock AS.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.forgerock.openbanking.directory.security;

import brave.Tracer;
import com.forgerock.openbanking.directory.error.ErrorHandler;
import org.junit.Before;
import org.junit.Test;
import uk.org.openbanking.datamodel.error.OBErrorResponse1;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.StringReader;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

public class JsonRequestSanitisiationFilterTest {
    private JsonRequestSanitisiationFilter jsonRequestSanitisiationFilter;
    private final Tracer tracer = TracerUtils.mockTracer();
    private FilterChain filterChain;
    private HttpServletRequest mockRequest;
    private HttpServletResponse mockResponse;
    private ErrorHandler errorHandler;

    @Before
    public void setup() {
        errorHandler = mock(ErrorHandler.class);
        filterChain = mock(FilterChain.class);
        mockRequest = mock(HttpServletRequest.class);
        mockResponse = mock(HttpServletResponse.class);
        jsonRequestSanitisiationFilter = new JsonRequestSanitisiationFilter(errorHandler, tracer);
    }

    @Test
    public void doFilter_ignoreGET() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("GET");

        // When
        jsonRequestSanitisiationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_ignoreDELETE() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("DELETE");

        // When
        jsonRequestSanitisiationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_ignoreNonJsonPOST() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn("application/xml");

        // When
        jsonRequestSanitisiationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_jsonWithNoHtml_passThrough() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn("application/json");
        given(mockRequest.getReader()).willReturn(new BufferedReader(new StringReader("{\"key\": \"value\"}")));

        // When
        jsonRequestSanitisiationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_jsonWithHtml_reject() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn("application/json");
        given(mockRequest.getReader()).willReturn(new BufferedReader(new StringReader("{\"key\": \"<script>alert()</script>\"}")));

        // When
        jsonRequestSanitisiationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verify(errorHandler).setHttpResponseToError(eq(mockResponse), any(OBErrorResponse1.class), eq(400));
        verifyZeroInteractions(filterChain);
    }
}