package com.outseer.webfingerprint.repository;

import com.outseer.webfingerprint.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, String> {
}
