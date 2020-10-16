<template>
  <div class="dashboard-editor-container">
    <el-button class="filter-item" type="primary" icon="el-icon-plus"
               @click="handleAddDialog">
      添加租户
    </el-button>
    <br>
    <el-table :data="list" style="width: 100%;padding-top: 15px;" v-loading="listLoading">
      <el-table-column label="ID" min-width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="租户名称" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="登录用户名" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column label="访问地址" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="fetchTenants"/>

    <!-- 新增或编辑租户Dialog -->
    <el-dialog :title="isTenantEdit?'修改租户':'添加租户'" :visible.sync="dialogTenantEditVisible">
      <el-form :model="tenantEditForm" :rules="tenantEditFormRules" ref="tenantEditForm" label-width="100px">
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="tenantEditForm.description"></el-input>
        </el-form-item>
        <el-form-item label="租户类型" prop="type">
          <el-select v-model="tenantEditForm.role" placeholder="请选择租户类型" :disabled="isTenantEdit">
            <el-option
              label="普通租户"
              value="tenant"
            ><span>普通租户</span>
            </el-option>
            <el-option
              label="租户管理员"
              value="admin"
            ><span>租户管理员</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录用户名">
          <el-input v-model="tenantEditForm.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="tenantEditForm.password"></el-input>
        </el-form-item>
        <el-form-item label="访问地址">
          <el-input v-model="tenantEditForm.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTenantEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTenantSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getUsers, removeUser, saveUser} from "@/api/user";
import Pagination from '@/components/Pagination'

export default {
  name: "Users",
  components: {Pagination},
  data() {
    return {
      list: null,
      total: 10,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogTenantEditVisible: false,
      dialogCertVisible: false,
      isTenantEdit: false,
      tenantEditForm: {
        id: null,
        description: '',
        username: '',
        password: '',
        role: 'tenant',
        url: ''
      },
      tenantEditFormRules: {
        description: [
          {required: true, message: '请输入租户名称', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '请输入登录用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入登录密码', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '请输入昂文地址', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.fetchTenants()
  },
  methods: {
    handleAddDialog() {
      this.isTenantEdit = false;
      // 初始化表单
      this.tenantEditForm.id = null
      this.tenantEditForm.description = ''
      this.tenantEditForm.username = ''
      this.tenantEditForm.password = ''
      this.tenantEditForm.url = ''
      this.tenantEditForm.role = 'tenant'
      this.dialogTenantEditVisible = true
    },
    handleTenantSave() {
      this.$refs['tenantEditForm'].validate((valid) => {
        if (valid) {
          saveUser(this.tenantEditForm).then(res => {
            this.fetchTenants()
            this.dialogTenantEditVisible = false
          })
        }
      });
    },
    handleEdit(row) {
      this.isTenantEdit = true
      this.tenantEditForm.id = row.id
      this.tenantEditForm.description = row.description
      this.tenantEditForm.username = row.username
      this.tenantEditForm.password = row.password
      this.tenantEditForm.url = row.url
      this.tenantEditForm.role = row.role
      this.dialogTenantEditVisible = true
    },

    handleDelete(uid) {
      this.$confirm('此操作将永久删除该租户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser(uid).then(res => {
          this.fetchTenants()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        })
      }).catch(() => {
      });
    },
    fetchTenants() {
      this.listLoading = true
      getUsers(this.listQuery.page, this.listQuery.limit).then(res => {
        let data = res['data']
        this.list = data['list']
        this.total = data['total']
      }).finally(() => {
        this.listLoading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
