<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <h1 class="my-5 inline-block text-2xl font-bold">管理投票者和選區資料</h1>
      <el-button
        round
        class="absolute top-1/2 ml-5 -translate-y-1/2 transform md:ml-10"
        @click="open = true"
        >使用說明</el-button
      >
   </div>
    <ElButton
      id="deleteAllData"
      type="danger"
      round
      @click="deleteAllDataDialogVisible = true"
    >
      刪除所有資料
    </ElButton>
    <ElDialog
      v-model="deleteAllDataDialogVisible"
      :z-index="1000"
      title="確認要刪除所有資料嗎?"
      width="500"
    >
      <span>刪除後將無法復原</span>
      <template #footer>
        <div class="dialog-footer">
          <ElButton 
            @click="deleteAllDataDialogVisible = false"
          >
            取消
          </ElButton>
          <ElButton
            type="danger"
            @click="deleteAllData"
          >
            確認刪除
          </ElButton>
        </div>
      </template>
    </ElDialog>
    <br>
    <br
    >
    <ElButton
      id="editIndividualData"
      plain
      @click="editDataDialogVisible = true"
    >
      投票人個別資料更動
    </ElButton>
    <ElDialog
      v-model="editDataDialogVisible"
      :z-index="1000"
      title="更動頁面"
      width="500"
    >
      <div style="text-align: -webkit-center">
        <ElInput
          v-model="queryInput"
          style="width: 240px"
          size="large"
          placeholder="請輸入學號"
        />
        <ElButton
          :icon="Search"
          size="large"
          @click="queryStudentData"
          >查詢</ElButton
        >
        <br><br>
        <template v-if="queryInputData !== ''">
          <ElText
            class="mx-1"
            type="info"
            >當前為學號{{ queryInputData }}的資料</ElText
          >
        </template>
        <br><br>
        <template v-if="studentIdStatus == studentIdStatusEnum.notFound">
          <ElText
            class="mx-1"
            size="large"
            type="danger"
          >
            資料不存在
          </ElText>
          <br>
          <br>
          <ElText
            class="mx-1"
            size="large"
          >
            新增資料
          </ElText>
          <br>
          <ElAutocomplete
            v-model="departmentInput"
            :fetch-suggestions="queryAllDepartment"
            class="inline-input w-50"
            :placeholder="`學號${queryInputData}的系別`"
            value-key="name"
          />
          <br>
          <br>
          <ElButton
            plain
            @click="addNewVoter"
          >
            新增
          </ElButton>
        </template>
        <template v-if="studentIdStatus == studentIdStatusEnum.Found">
          <ElText
            class="mx-1"
            size="large"
          >
            系別&nbsp; : &nbsp;{{ voterData!.department }} &nbsp;&nbsp;
          </ElText>
          <ElAutocomplete
            v-model="departmentInput"
            :fetch-suggestions="queryAllDepartment"
            class="inline-input w-50"
            :placeholder="`改動學號${queryInputData}系別`"
            value-key="name"
          />
          <ElButton @click="modifyDepartment">修改</ElButton>
          <br>
          <br>
          <ElButton
            type="danger"
            @click="deleteVoterData"
            >刪除此投票者資料</ElButton
          >
        </template>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <ElButton
            type="primary"
            @click="editDataDialogVisible = false"
          >
            關閉頁面
          </ElButton>
        </div>
      </template>
    </ElDialog>
    <el-tour v-model="open">
      <el-tour-step
        :target="'#deleteAllData'"
        title="刪除所有資料"
        description="將選舉區、投票人資料全部清空，並回到step1重新上傳"
      />
      <el-tour-step
        :target="'#editIndividualData'"
        title="個別更動選舉人資料"
        description="可透過搜尋學號，更動個別選舉人之資料"
      />
    </el-tour>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
// import { useFetch } from '@nuxtjs/composition-api';
import { Search } from "@element-plus/icons-vue";

const open = ref(false);
const deleteAllDataDialogVisible = ref(false);
const editDataDialogVisible = ref(false);
const queryInput = ref("");
const departmentInput = ref("");
const queryInputData = ref("");

enum studentIdStatusEnum {
  noInput,
  notFound,
  Found,
}

const studentIdStatus = ref(studentIdStatusEnum.noInput);

const voterData = ref<{
  id: number;
  department: string;
} | null>(null);

const emit = defineEmits(["data-deleted"]);

const queryStudentData = async () => {
  queryInputData.value = queryInput.value;
  const { data: res, error } = await useFetch<{
    id: number;
    department: string;
  }>("/api/voter/getVoterAndDepartment", {
    query: { voter: parseInt(queryInput.value) },
  });
  if (error.value) {
    studentIdStatus.value = studentIdStatusEnum.notFound;
    return;
  }
  voterData.value = res.value;
  studentIdStatus.value = studentIdStatusEnum.Found;
  departmentInput.value = "";
};

const modifyDepartment = async () => {
  const { error } = await useFetch("/api/voter/update", {
    method: "POST",
    body: {
      voterId: parseInt(queryInputData.value),
      voterDepartment: departmentInput.value,
    },
  });
  if (error.value) {
    ElMessage.error("修改失敗");
  } else {
    ElMessage.success("修改成功");
  }
  queryStudentData();
};

const deleteVoterData = async () => {
  const { error } = await useFetch("/api/voter/del", {
    method: "DELETE",
    query: { id: queryInputData.value },
  });
  queryInput.value = "";
  studentIdStatus.value = studentIdStatusEnum.noInput;
  if (error.value) {
    ElMessage.error("刪除失敗");
  } else {
    ElMessage.success("刪除成功");
  }
};

const addNewVoter = async () => {
  const addNewStudentId = queryInputData.value;
  const addNewDepartment = departmentInput.value;
  const { error } = await useFetch("/api/voter/add", {
    method: "PUT",
    query: {
      id: addNewStudentId,
      department: addNewDepartment,
    },
  });
  if (error.value) {
    ElMessage.error("新增失敗");
  } else {
    ElMessage.success("新增成功");
  }
  queryStudentData();
};

const deleteAllData = async () => {
  const { error: voterError } = await useFetch("/api/voter/delAll", {
    method: "DELETE",
  });
  const { error: departmentError } = await useFetch("/api/department/delAll", {
    method: "DELETE",
  });

  deleteAllDataDialogVisible.value = false;

  if (voterError.value || departmentError.value) {
    ElMessage.error("刪除失敗");
  } else {
    ElMessage.success("刪除成功");
    emit("data-deleted");
  }
};

interface Department {
  id: number;
  name: string;
}

const departmentList = ref<Department[]>([]);

const queryAllDepartment = (
  queryString: string,
  cb: (results: { id: number; name: string }[]) => void,
) => {
  const results = queryString
    ? departmentList.value.filter(createFilter(queryString))
    : departmentList.value;
  cb(results);
};

const createFilter = (queryString: string) => {
  return (department: Department) => {
    return department.name.indexOf(queryString) === 0;
  };
};

onMounted(async () => {
  departmentList.value = await loadAll();
});

const errHandle = (err: any) => {
  if (err.value.data == null || "" + err.value.data.message == "undefined") {
    return " 發生未知錯誤";
  } else {
    return " " + err.value.data.message;
  }
};

const loadAll = async () => {
  const { data: departments, error } = await useFetch("/api/department/getAll");
  if (error.value) {
    ElMessage.error("獲取系所列表失敗" + errHandle(error));
  }
  return departments.value!;
};
</script>
