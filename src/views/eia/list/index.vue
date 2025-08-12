<script setup lang="ts">
import { ref } from 'vue'

const regions = [
  'California (CAL)', 'Carolinas (CAR)', 'Central (CENT)', 'Florida (FLA)',
  'Mid-Atlantic (MIDA)', 'Midwest (MIDW)', 'New England (NE)', 'Northwest (NW)',
  'New York (NY)', 'Southeast (SE)', 'Southwest (SW)', 'Tennessee (TEN)',
  'Texas (TEX)', 'United States Lower 48 (US48)'
]

const authorities = [
  'Associated Electric Cooperative, Inc. (AECI)', 'Avista Corporation (AVA)', 'Avangrid Renewables, LLC (AVRN)',
  'Arizona Public Service Company (AZPS)', 'Balancing Authority of Northern California (BANC)',
  'Bonneville Power Administration (BPAT)', 'Public Utility District No. 1 of Chelan County (CHPD)',
  'California Independent System Operator (CISO)', 'Duke Energy Progress East (CPLE)',
  'Duke Energy Carolinas (DUK)', 'Duke Energy Progress West (CPLW)',
  'Arlington Valley, LLC (DEAA)', 'PUD No. 1 of Douglas County (DOPD)',
  'El Paso Electric Company (EPE)', 'Electric Reliability Council of Texas, Inc. (ERCO)',
  // ...继续补全
]

const searchValue = ref('')
</script>

<template>
  <div style="padding: 24px; background: #f5f5f5">
    <!-- 标题 -->
    <h1>EIA Data Browser</h1>

    <!-- About 区域 -->
    <a-alert
        type="info"
        show-icon
        closable
        message="About This data"
        description="This data comes from the U.S Energy Information Administration, specifically Form EIA-930. Note that the data might differ from what ISOs/RTOs report..."
        style="margin-bottom: 16px"
    />

    <!-- 搜索框 -->
    <a-input
        v-model:value="searchValue"
        placeholder="Find area"
        allow-clear
        style="margin-bottom: 16px; width: 100%"
    />

    <!-- Regions -->
    <a-typography-title :level="4">Regions ({{ regions.length }})</a-typography-title>
    <a-space wrap style="margin-bottom: 24px" :size="[8, 15]">
      <a-button v-for="region in regions" :key="region">
        {{ region }}
      </a-button>
    </a-space>

    <!-- Balancing Authorities -->
    <a-typography-title :level="4">Balancing Authorities ({{ authorities.length }})</a-typography-title>
    <a-space wrap :size="[8, 15]">
      <a-button v-for="auth in authorities" :key="auth">
        {{ auth }}
      </a-button>
    </a-space>
  </div>
</template>

<style scoped>
.ant-btn {
  background: #dee0e5;
  border: none;
}
</style>
