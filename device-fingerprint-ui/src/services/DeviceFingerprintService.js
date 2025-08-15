import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:8080/api';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export const getDeviceData = (hash) => {
    return new Observable(subscriber => {
        fetch(`${API_BASE_URL}/device/${hash}`, {
            method: 'GET',
            headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                subscriber.next(data);
                subscriber.complete();
            })
            .catch(error => {
                console.error('Error fetching device data:', error);
                subscriber.error(error);
            });
    });
};

export const createDevice = (deviceData) => {
    return new Observable(subscriber => {
        fetch(`${API_BASE_URL}/device`, {
            method: 'POST',
            headers,
            body: JSON.stringify(deviceData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                subscriber.next(data);
                subscriber.complete();
            })
            .catch(error => {
                console.error('Error creating device:', error);
                subscriber.error(error);
            });
    });
};

export const getBackendStatus = () => {
    return new Observable(subscriber => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        fetch('http://localhost:8080/actuator/info', { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error('Backend unavailable');
                return response.json();
            })
            .then(data => {
                subscriber.next(data);
                subscriber.complete();
            })
            .catch(error => {
                subscriber.error(error);
            });

        return () => clearTimeout(timeoutId);
    });
};