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
    <el-progress :percentage="uploadProgress.progress" />
    <el-button type="primary" @click="doSubmit">上传文件</el-button>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef } from 'vue';
import SparkMD5 from 'spark-md5';
import { existsApi, uploadApi } from '@/api/file';

const uploadDom = shallowRef();
const fileRaw = ref({});
const uploadProgress = reactive({
  exists: [],
  progress: 0,
  pending: false
});
const fileChange = ({ raw }) => {
  uploadProgress.exists = [];
  uploadProgress.progress = 0;
  uploadProgress.pending = false;

  fileRaw.value = raw;
  uploadDom.value.clearFiles();
};

const file = {
  chunkSize: 5 * 1024 * 1024,
  data: null,
  hash: '',
  name: '',
  size: 0,
  chunks: 0
};
const getHash = (data, fragment = true) => {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject('不存在文件');
    }

    const spark = new SparkMD5.ArrayBuffer();
    const fr = new FileReader();
    let chunkIdx = 0;

    const loadNext = () => {
      const start = chunkIdx * file.chunkSize;
      const end = (chunkIdx + 1) * file.chunkSize;
      const fileSplit = data.slice(start, end);
      fr.readAsArrayBuffer(fileSplit);
    };

    fr.onload = () => {
      spark.append(fr.result);
      chunkIdx += 1;

      if (fragment && chunkIdx < file.chunks) {
        chunkIdx = file.chunks - 1;
      }

      if (chunkIdx < file.chunks) {
        loadNext();
        return;
      }

      const hash = spark.end();
      resolve(hash);
    };

    loadNext();
  });
};
const uploadChunkApi = (fd, onUploadProgress) => {
  return new Promise((resolve, reject) => {
    uploadApi(fd, onUploadProgress)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
const handlerChunk = async () => {
  const requestList = [];

  for (let i = 0; i < file.chunks; i++) {
    if (uploadProgress.exists.includes(i)) {
      return;
    }

    const start = i * file.chunkSize;
    const end = (i + 1) * file.chunkSize;
    const fileSplit = file.data.slice(start, end);
    const currentHash = await getHash(fileSplit, false);
    const fd = new FormData();
    fd.append('file', fileSplit);
    fd.append('hash', file.hash);
    fd.append('name', file.name);
    fd.append('size', file.size);
    fd.append('chunks', file.chunks);
    fd.append('chunkIdx', i);
    fd.append('currentHash', currentHash);
    const progressEvent = e => {
      if (e.loaded !== e.total) {
        return;
      }

      uploadProgress.exists.push(i);
      uploadProgress.progress = Math.ceil(uploadProgress.exists.length / file.chunks);
    };
    requestList.push(uploadChunkApi(fd, progressEvent));
  }

  Promise.all(requestList)
    .then(() => {
      uploadProgress.pending = false;
    })
    .catch(() => {
      uploadProgress.pending = false;
    });
};
const doSubmit = async () => {
  uploadProgress.exists = [];
  uploadProgress.progress = 0;
  uploadProgress.pending = true;

  const { name, size } = fileRaw.value;
  file.data = fileRaw.value;
  file.name = name;
  file.size = size;
  file.chunks = Math.ceil(size / file.chunkSize);

  file.hash = await getHash(file.data);
  const existsRes = await existsApi({ hash: file.hash, size });

  if (typeof existsRes.data === 'boolean') {
    uploadProgress.progress = 100;
    uploadProgress.pending = false;
    return;
  }

  uploadProgress.exists = existsRes.data;
  uploadProgress.progress = Math.ceil(existsRes.data.length / file.chunks);
  handlerChunk();
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

  .el-progress {
    width: 100%;
  }
}
</style>
