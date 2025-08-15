package com.outseer.webfingerprint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

@SpringBootApplication
@EnableCaching
public class WebFingerPrintApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebFingerPrintApplication.class, args);
	}

	@Bean
	public CacheManager cacheManager() {
		return new ConcurrentMapCacheManager("devices");
	}
}
