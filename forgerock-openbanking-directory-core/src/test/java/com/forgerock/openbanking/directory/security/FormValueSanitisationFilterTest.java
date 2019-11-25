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
package com.forgerock.openbanking.directory.security; /**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

import brave.Tracer;
import com.forgerock.openbanking.directory.error.ErrorHandler;
import com.google.common.collect.ImmutableMap;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import uk.org.openbanking.datamodel.error.OBErrorResponse1;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;

public class FormValueSanitisationFilterTest {
    private FormValueSanitisationFilter formValueSanitisationFilter;
    private final Tracer tracer = TracerUtils.mockTracer();

    private FilterChain filterChain;
    private HttpServletRequest mockRequest;
    private HttpServletResponse mockResponse;
    private ErrorHandler errorHandler;

    @Before
    public void setUp() throws Exception {
        errorHandler = mock(ErrorHandler.class);
        filterChain = mock(FilterChain.class);
        mockRequest = mock(HttpServletRequest.class);
        mockResponse = mock(HttpServletResponse.class);
        formValueSanitisationFilter = new FormValueSanitisationFilter(errorHandler, tracer);
    }

    @Test
    public void doFilter_ignoreGET() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("GET");

        // When
        formValueSanitisationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_ignoreDELETE() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("DELETE");

        // When
        formValueSanitisationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_ignoreNonMultipartForm() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn(MediaType.APPLICATION_JSON_UTF8_VALUE);

        // When
        formValueSanitisationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_ignoreNullForm() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn(MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        given(mockRequest.getParameterMap()).willReturn(null);

        // When
        formValueSanitisationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_formWithNoHtmlValues_passThrough() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn(MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        given(mockRequest.getParameterMap()).willReturn(ImmutableMap.of("key1", new String[] {"value1"}));

        // When
        formValueSanitisationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verifyZeroInteractions(errorHandler);
        verify(filterChain, times(1)).doFilter(any(), any());
    }

    @Test
    public void doFilter_formWithHtmlValue_reject() throws Exception {
        // Given
        given(mockRequest.getMethod()).willReturn("POST");
        given(mockRequest.getContentType()).willReturn(MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        given(mockRequest.getParameterMap()).willReturn(ImmutableMap.of("key1", new String[] {"<script>alert()</script>"}));

        // When
        formValueSanitisationFilter.doFilter(mockRequest, mockResponse, filterChain);

        // Then
        verify(errorHandler).setHttpResponseToError(eq(mockResponse), any(OBErrorResponse1.class), eq(400));
        verifyZeroInteractions(filterChain);
    }

}