import SparkMD5 from 'spark-md5';

export default class Upload {
  constructor(file = null) {
    this.chunkSize = 5 * 1024 * 1024;
    this.file = file;
    this.size = file?.size || 0;
    this.chunks = Math.ceil(this.size / this.chunkSize);
    this.hashVal = '';
  }

  update(file) {
    this.file = file;
    this.size = file?.size || 0;
    this.chunks = Math.ceil(this.size / this.chunkSize);
    this.hashVal = '';
  }

  hash(fragment = true) {
    return new Promise((resolve, reject) => {
      if (!this.file) {
        return reject('不存在文件');
      }

      const spark = new SparkMD5.ArrayBuffer();
      const fr = new FileReader();
      let chunkIdx = 0;

      const loadNext = () => {
        const start = chunkIdx * this.chunkSize;
        const end = (chunkIdx + 1) * this.chunkSize;
        const file = this.file.slice(start, end);
        fr.readAsArrayBuffer(file);
      };

      fr.onload = () => {
        spark.append(fr.result);
        chunkIdx += 1;

        if (fragment && chunkIdx < this.chunks) {
          chunkIdx = this.chunks - 1;
        }

        if (chunkIdx < this.chunks) {
          loadNext();
          return;
        }

        this.hashVal = spark.end();
        resolve(this.hashVal);
      };

      loadNext();
    });
  }

  uploadChunk(exists, callback) {
    for (let i = 0; i < this.chunks; i++) {
      if (exists?.includes(i)) {
        return;
      }

      const start = i * this.chunkSize;
      const end = (i + 1) * this.chunkSize;
      const file = this.file.slice(start, end);
      const fd = new FormData();
      fd.append('hash', this.hashVal);
      fd.append('name', this.file.name);
      fd.append('size', this.size);
      fd.append('chunks', this.chunks);
      fd.append('file', file);
      fd.append('chunkIdx', i);

      callback(fd);
    }
  }
}
