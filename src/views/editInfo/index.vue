<template>
  <div style="padding:20px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="100px" size="medium">
      <el-form-item label="昵称" prop="nickname" >
        <el-input v-model="ruleForm.nickname" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="地区" prop="area">
        <el-input v-model="ruleForm.area" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="ruleForm.phone" type="number" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-input v-model="ruleForm.birthday" type="number" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="星座" prop="constellation">
        <el-input v-model="ruleForm.constellation" type="number" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="座右铭" prop="motto">
        <el-input v-model="ruleForm.motto" type="number" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="photo">
        <el-input type="file" v-model="ruleForm.photo" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">立即创建</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<!--性别、地区、生日、星座、座右铭-->
<script>
export default {
  name: "editInfo",
  data(){
    return {
      ruleForm: {
        nickname: '',
        area: '',
        phone: '',
        birthday: '',
        constellation: '',
        motto: '',
        photo: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        photo: [
          { required: true, message: '请上传头像', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // TODO 调用接口
          alert('submit!');
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>

<style scoped>

</style>
