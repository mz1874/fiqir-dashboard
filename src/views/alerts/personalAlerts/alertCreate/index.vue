<script setup lang="ts">
import { ref } from 'vue';
import { Form as AForm, Input, Select, Switch, Alert } from 'ant-design-vue';
const { Option } = Select;

const formRef = ref();
const formState = ref({
  alertName: 'New Alert',
  series: undefined,
  condition: 'gte',
  value: undefined,
  email: true,
  timeout: 'No timeout',
  status: true,
});

const onFinish = (values) => {
  console.log('Form values:', values);
};

const rules = {
  alertName: [{ required: true, message: 'Please input the alert name' }],
  value: [{ required: true, message: 'Please input the value' }],
};
</script>

<template>
  <div>
    <h1>Define New Alert</h1>
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        @finish="onFinish"
        layout="vertical"
        style="background-color: #ffffff; border-radius: 8px; padding: 16px;"
    >
      <a-form-item label="Name your alert" name="alertName" :help="'You will see this name when receiving notifications'" style="margin-bottom: 20px;">
        <a-input v-model:value="formState.alertName" placeholder="New Alert" />
      </a-form-item>

      <a-form-item label="What would you like to monitor?" name="monitorCondition" :help="'The alert will be triggered if the condition is met for any new row in the dataset since the last time the alert was run.'" style="margin-bottom: 20px;">
        <div style="display: flex; gap: 8px;">
          <a-form-item name="series" no-style>
            <a-select v-model:value="formState.series" placeholder="Select data" style="width: 200px;">
              <a-select-option value="series1">Series 1</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="condition" no-style>
            <a-select v-model:value="formState.condition" placeholder="Is" style="width: 150px;">
              <a-select-option value="gte">Greater than or equal to</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="value" no-style :rules="rules.value">
            <a-input v-model:value="formState.value" placeholder="Value" style="width: 150px;" />
          </a-form-item>
        </div>
      </a-form-item>

      <a-form-item label="How should you be notified?" name="notificationMethods" :help="'When the alert is enabled, notifications will be sent via these methods. Notifications can only be sent to the primary email address and/or phone number on your account.'" style="margin-bottom: 20px;">
        <a-form-item name="email" no-style value-prop-name="checked">
          <a-switch v-model:checked="formState.email" checked-children="On" un-checked-children="Off" />
        </a-form-item>
        <a-input v-model:value="formState.emailAddress" value="j21035099@student.newinti.edu.my" disabled style="width: 250px; margin-left: 10px;" />
        <a-alert message="Want to receive notifications via SMS? Upgrade to Grid Status Pro to enable SMS alerts." type="info" style="margin-top: 10px;" />
      </a-form-item>

      <a-form-item label="Notification Timeout" name="timeout" :help="'After the alert is triggered, how long should we wait before sending another notification?'" style="margin-bottom: 20px;">
        <a-input v-model:value="formState.timeout" placeholder="No timeout" />
      </a-form-item>

      <a-form-item label="Alert Status" name="status" value-prop-name="checked" style="margin-bottom: 20px;">
        <a-switch v-model:checked="formState.status" checked-children="Enabled" un-checked-children="Disabled" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" class="ant-btn ant-btn-primary">Create</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.ant-form-item-label > label {
  font-weight: bold;
}
.ant-form-item-help {
  color: #888;
}
</style>