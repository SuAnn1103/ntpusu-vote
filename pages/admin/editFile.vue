<template>
    <div>
        <!-- 刪除選區 -->
    <div class="demo-progress">
      <ElText
        v-if="deletingDialogVisible"
        class="mx-1"
        size="large"
        >刪除中...</ElText
      >
      <!-- 顯示刪除進度條 -->
      <ElProgress
        v-if="deletingDialogVisible"
        class="mt-3 w-2/3"
        :percentage="100"
        status="exception"
        :indeterminate="true"
        :duration="1"
      />
    </div>
    <ElText
      v-if="!uploadDialogVisible && !deletingDialogVisible"
      class="mx-1"
      size="large"
      >目前系統內有{{ electorCount }}筆資料</ElText
    >
    <br>
    <ElButton
      v-if="electorCount != 0"
      id="deleteAllDepartments"
      type="danger"
      @click="deleteGroupData"
      >刪除所有選區</ElButton
    >
    <br>
      </div>
  </template>
  

  <script setup lang="ts">
  enum studentIdStatusEnum {
  noInput,
  notFound,
  Found,
  }
  
  const queryInput = ref("");
  const departmentIdStatus = ref(studentIdStatusEnum.noInput);
  const uploadDialogVisible = ref(false);
  const deletingDialogVisible = ref(false);

  const { data: electorCount, refresh: electorCountRefresh } = await useFetch(
  "/api/department/getCnt",
);

const deleteGroupData = async () => {
  ElMessageBox.confirm("確定要刪除所有選區嗎？", "刪除選區", {
    confirmButtonText: "刪除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      deletingDialogVisible.value = true;
      await $fetch("/api/department/delAll", {
        method: "DELETE",
      })
        .catch(() => {
          ElMessage.error("刪除失敗");
        })
        .finally(() => {
          ElMessage.success("刪除成功");

          queryInput.value = "";
          departmentIdStatus.value = studentIdStatusEnum.noInput;
          electorCountRefresh();
          electorDetailRefresh();
        });

      deletingDialogVisible.value = false;
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消刪除",
      });
    });
};
  
</script>
  