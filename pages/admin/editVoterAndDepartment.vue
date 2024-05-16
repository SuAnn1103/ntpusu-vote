<template>
  <div>
    <div class="flex h-full items-center justify-center">
      <el-steps
        class="w-full text-center font-bold md:w-1/2 lg:w-1/3"
        :active="currentStep"
        finish-status="success"
        align-center
      >
        <el-step
          title="Step 1"
          description="管理選舉區"
        />
        <el-step
          title="Step 2"
          description="管理投票者"
        />
      </el-steps>
    </div>
    <div class="content">
      <template v-if="currentPage === 'editDepartment'">
        <editDepatment />
      </template>
      <template v-else-if="currentPage === 'editVoter'">
        <editVoter />
      </template>
    </div>
    <div>
      <el-button
        class="my-5 ml-3"
        :style="{ display: currentStep === 0 ? 'none' : '' }"
        @click="prevStep"
        >上一步</el-button
      >
      <el-button
        class="my-5 mr-3"
        :style="{ display: currentStep === 0 ? '' : 'none' }"
        @click="nextStep"
        >下一步</el-button
      >
      <el-button
        class="my-5 mr-3"
        :style="{ display: currentStep === steps.length - 2 ? '' : 'none' }"
        @click="nextStep"
        >完成</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import editDepatment from "~/pages/admin/editDepartment.vue";
import editVoter from "~/pages/admin/editVoter.vue";

const currentStep = ref(0);
const steps = ["editDepartment", "editVoter", "editFile"];
const currentPage = ref("editDepartment");

watch(currentStep, (newStep) => {
  if (newStep === 0) {
    currentPage.value = "editDepartment";
  } else if (newStep === 1) {
    currentPage.value = "editVoter";
  } else if (newStep === 2) {
    currentPage.value = "editFile";
  }
});

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};
</script>
