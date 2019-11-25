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

import org.junit.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;


public class TextSanitiserServiceTest {

    @Test
    public void hasHtmlContent_form() {
        // Hasn't any html

        assertThat(TextSanitiserService.hasHtmlContent(new TestEntry("key", ""))).isFalse();
        assertThat(TextSanitiserService.hasHtmlContent(new TestEntry("key", "testtext"))).isFalse();
        assertThat(TextSanitiserService.hasHtmlContent(new TestEntry("key", "&lt;script&gt;"))).isFalse();

        // Has html
        assertThat(TextSanitiserService.hasHtmlContent(new TestEntry("key", "test<h1>text"))).isTrue();
        assertThat(TextSanitiserService.hasHtmlContent(new TestEntry("key", "<p>"))).isTrue();
        assertThat(TextSanitiserService.hasHtmlContent(new TestEntry("key", "<script>alert()</script>"))).isTrue();
    }

    @Test
    public void hasHtmlContent_string() {
        // Hasn't any html
        assertThat(TextSanitiserService.hasHtmlContent("")).isFalse();
        assertThat(TextSanitiserService.hasHtmlContent("testtext")).isFalse();
        assertThat(TextSanitiserService.hasHtmlContent("&lt;script&gt;")).isFalse();
        assertThat(TextSanitiserService.hasHtmlContent("{value}")).isFalse();
        assertThat(TextSanitiserService.hasHtmlContent("http://www.google.com?var=val&var2=val2")).isFalse();

        // Has html
        assertThat(TextSanitiserService.hasHtmlContent("test<h1>text")).isTrue();
        assertThat(TextSanitiserService.hasHtmlContent("<p>")).isTrue();
        assertThat(TextSanitiserService.hasHtmlContent("<script>alert()</script>")).isTrue();
    }

    private static class TestEntry implements Map.Entry<String, String[]> {
        private String key;
        private String[] value;

        TestEntry(String key, String value) {
            this.key = key;
            this.value = new String[] {value};
        }

        @Override
        public String getKey() {
            return key;
        }

        @Override
        public String[] getValue() {
            return value;
        }

        @Override
        public String[] setValue(String[] value) {
            this.value = value;
            return value;
        }
    }
}