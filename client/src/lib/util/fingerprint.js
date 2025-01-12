// mobility-report/client/src/lib/util/fingerprint.js
export class DeviceFingerprint {
  static async generate() {
    const components = {
      hardware: {
        platform: navigator.platform,
        cores: navigator.hardwareConcurrency,
        memory: navigator.deviceMemory,
        screen: {
          width: screen.width,
          height: screen.height,
          ratio: window.devicePixelRatio,
        },
      },
      software: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    return {
      hash: await this.generateHash(components),
      components,
      confidence: this.calculateConfidence(components),
    };
  }

  static async generateHash(components) {
    const str = JSON.stringify(components);
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  static calculateConfidence(components) {
    let score = 1.0;
    if (!components.hardware.memory) score *= 0.9;
    if (!components.hardware.cores) score *= 0.9;
    return score;
  }
}
