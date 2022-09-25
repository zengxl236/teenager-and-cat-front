<template>
  <div class="upload-page">
    <el-upload
      ref="uploadDom"
      class="upload"
      drag
      action=""
      :auto-upload="false"
      :show-file-list="false"
      @change="fileChange"
    ></el-upload>
    <el-tag v-if="fileRaw.name" type="info">{{ fileRaw.name }}</el-tag>
    <el-button type="primary" @click="doSubmit">上传文件</el-button>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import Upload from './index';
import { existsApi } from '@/api/file';

const uploadDom = shallowRef();
const fileRaw = ref({});
const fileChange = ({ raw }) => {
  fileRaw.value = raw;
  uploadDom.value.clearFiles();
};

const upload = new Upload();
const doSubmit = async () => {
  upload.update(fileRaw.value);
  const hash = await upload.hash();
  const { size } = fileRaw.value;

  existsApi({ hash, size }).then(res => {
    console.log(res);
  });
};
</script>

<style lang="scss">
.upload-page {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 50%;
  height: 30%;
  margin: 100px auto;

  .upload,
  .el-upload,
  .el-upload-dragger {
    width: 100%;
    height: 100%;
  }
}
</style>
