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
        <editDepartment />
      </template>
      <template v-else-if="currentPage === 'editVoter'">
        <editVoter />
      </template>
      <template v-else-if="currentPage === 'deleteAndEdit'">
        <deleteAndEdit @data-deleted="handleDataDeleted" />
      </template>
    </div>
    <div class="text-right my-5" >
      <!-- <el-button
        class="my-5"
        :style="{ display: currentStep === 0 ? 'none' : '' }"
        @click="prevStep"
      >
        上一步
      </el-button> -->
      <el-button
        :disabled="isNextDisabled"
        class="my-5"
        :style="{ display: currentStep === 0 ? '' : 'none' }"
        @click="nextStep"
      >
        下一步
      </el-button>
      <el-button
        :disabled="isNextDisabled"
        class="my-5"
        :style="{ display: currentStep === steps.length - 2 ? '' : 'none' }"
        @click="nextStep"
      >
        完成
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import editDepartment from "~/pages/admin/editDepartment.vue";
import editVoter from "~/pages/admin/editVoter.vue";
import deleteAndEdit from "~/pages/admin/deleteAndEdit.vue";

const currentStep = ref(0);
const steps = ["editDepartment", "editVoter", "deleteAndEdit"];
const currentPage = ref("editDepartment");

const electorCounter = useState("electorCounter", () => 0);
const voterCounter = useState("voterCounter", () => 0);

const isNextDisabled = computed(() => {
  if (currentStep.value === 0) {
    console.log("electorCounter:"+electorCounter.value);
    return electorCounter.value === 0;
  } else if (currentStep.value === 1) {
    return voterCounter.value === 0;
  }
  return false;
});

// const prevStep = () => {
//   if (currentStep.value > 0) {
//     currentStep.value--;
//     currentPage.value = steps[currentStep.value];
//   }
// };

const nextStep = async () => {
  if (currentStep.value === 0) {
    currentStep.value = 1;
    currentPage.value = "editVoter";
  } else if (currentStep.value === 1) {
    currentStep.value = 2;
    currentPage.value = "deleteAndEdit";
  }
};

const handleDataDeleted = () => {
  currentStep.value = 0;
  currentPage.value = "editDepartment";
};
</script>
