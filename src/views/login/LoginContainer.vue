<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="22" :lg="18" :xl="14" class="container">
        <div class="el-row">
          <el-col :xs="0" :sm="10" :md="12" :lg="12" :xl="14">
            <img src="@/assets/images/login-left.png" />
          </el-col>
          <el-col :xs="24" :sm="14" :md="12" :lg="12" :xl="10" class="form">
            <h1>
              <span>L</span>
              <span>O</span>
              <span>G</span>
              <span>I</span>
              <span>N</span>
            </h1>
            <h2>Welcome back</h2>
            <el-form ref="formDom" :model="form" :rules="formRules">
              <el-form-item prop="username">
                <el-input
                  :ref="dom => setInputDom(dom, 'username')"
                  v-model="form.username"
                  @focus="inputFocus('username')"
                  @blur="inputBlur('username')"
                  @keydown.enter="doLogin"
                ></el-input>
                <span class="label username">USERNAME</span>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  :ref="dom => setInputDom(dom, 'password')"
                  v-model="form.password"
                  type="password"
                  @focus="inputFocus('password')"
                  @blur="inputBlur('password')"
                  @keydown.enter="doLogin"
                ></el-input>
                <span class="label password">PASSWORD</span>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="rememberThePassword" :label="true">记住密码</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="doLogin">登陆</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, shallowReactive, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/user';
import { loginApi } from '@/api/user';

// 定义数据
const formDom = shallowRef();
const form = reactive({});
const rememberThePassword = ref(false);
const formRules = {
  username: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }]
};

// 焦点事件修改样式
const inputDom = shallowReactive({});
const setInputDom = (dom, attr) => {
  inputDom[attr] = dom;
};
// 焦点事件
const inputFocus = attr => {
  const elInput = inputDom[attr]?.$el;
  const label = elInput?.nextSibling;

  if (!label) {
    return;
  }

  elInput.classList.add('border');
  label.classList.add('top');
};
// 失去焦点事件
const inputBlur = attr => {
  if (form[attr]) {
    return;
  }

  const elInput = inputDom[attr]?.$el;
  const label = elInput?.nextSibling;

  if (!label) {
    return;
  }

  elInput.classList.remove('border');
  label.classList.remove('top');
};

// 页面初始化，获取数据
const init = () => {
  const username = window.localStorage.getItem('username') || '';
  const password = window.atob(window.localStorage.getItem('password') || '');

  if (username) {
    inputFocus('username');
  }
  if (password) {
    inputFocus('password');
  }

  form.username = username;
  form.password = password;
  rememberThePassword.value = !!password;
};
onMounted(() => {
  init();
});

// 登录，store 存储数据
const router = useRouter();
const userStore = useUserStore();
const doLogin = () => {
  formDom.value.validate(valid => {
    if (!valid) {
      return;
    }

    loginApi(form).then(res => {
      const { id, token } = res.data;

      userStore.setToken(token);
      userStore.setUserInfo({ id, username: form.username });

      if (rememberThePassword.value) {
        window.localStorage.setItem('password', window.btoa(form.password));
      } else {
        window.localStorage.removeItem('password');
      }

      router.push('/');
    });
  });
};
</script>

<style lang="scss">
.login-container {
  display: grid;
  place-items: center;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  background: url('@/assets/images/login-bg.jpg') no-repeat;
  background-size: 100% 100%;

  .el-row {
    width: 100%;
    justify-content: center;
  }

  .container {
    background-color: #ffffff;
    border-radius: 4px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .form {
    padding: 20px;
    box-sizing: border-box;

    h1 {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin: 0 0 6px 0;
      color: #002fa7;
      font-size: 50px;
      line-height: 1 !important;

      span:nth-child(even) {
        font-size: 40px;
        color: #f3ce03;
        border-bottom: 6px solid #f3ce03;
      }
    }

    h2 {
      margin: 0 0 20px 0;
      font-size: 26px;
      font-weight: 400;
    }
  }

  .el-form {
    .el-form-item {
      margin-bottom: 30px;
      position: relative;
    }

    .el-input {
      .el-input__inner {
        height: 50px;
        line-height: 50px;
        font-size: 18px;
      }

      .el-input__wrapper {
        background-color: #f3f3fe;
        box-shadow: none;
        border: 1px solid #00000000;
        transition: all 0.2s;
      }

      &.border .el-input__wrapper {
        border-color: #002fa7;
      }
    }

    .el-button {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      letter-spacing: 10px;
      box-shadow: 0 20px 30px -10px #002fa7;
      transition: all 0.2s;

      &:hover {
        background-color: #002fa7;
        box-shadow: 0 10px 30px -10px #002fa7;
      }
    }

    .label {
      display: inline-grid;
      place-items: center;
      height: 30px;
      padding: 4px 11px;
      line-height: 1;
      letter-spacing: 2px;
      border-radius: 4px;
      box-sizing: border-box;
      position: absolute;
      z-index: 2;
      transition: all 0.2s;
      user-select: none;
      pointer-events: none;
      top: 12px;
      left: 6px;
      transform: scale(0.95);
      color: #465c72;
      border: 1px solid #00000000;

      &.username.top {
        top: -15px;
        left: 0px;
        transform: scale(0.85);
        color: #002fa7;
        border-color: #002fa7;
        background-image: linear-gradient(#ffffff 0, #ffffff 50%, #f3f3fe 0, #f3f3fe);
      }

      &.password.top {
        top: -15px;
        left: 0px;
        transform: scale(0.85);
        color: #ffffff;
        background-color: #002fa7;
      }
    }
  }
}
</style>
