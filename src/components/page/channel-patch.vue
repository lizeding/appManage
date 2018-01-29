<template>
  <div>
    <el-dialog title="渠道补丁列表" :visible="channelPatchState" width="90%" :before-close="closeDialog">

      <!--add android patch-->
      <el-dialog title="添加渠道补丁"
                 :visible="channelPatchForm"
                 width="90%" append-to-body
                 :before-close="closeAddPatchForm">
        <el-form>
          <el-form-item label="补丁版本" :label-width="formLabelWidth">
            <el-input v-model="form.version" auto-complete="off" placeholder="请输入渠道名称"></el-input>
          </el-form-item>

          <el-form-item label="补丁描述" :label-width="formLabelWidth">
            <el-input v-model="form.desc" auto-complete="off" placeholder="请输入渠道名称"></el-input>
          </el-form-item>

          <el-form-item label="是否下发" :label-width="formLabelWidth">
            <el-switch v-model="form.issue"></el-switch>
          </el-form-item>

          <el-form-item label="下发条件" :label-width="formLabelWidth">
            <div class="block">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="selectedOptions2"
                @change="handleChange">
              </el-cascader>
            </div>
          </el-form-item>

          <el-form-item label="上传补丁" :label-width="formLabelWidth">
            <input type="file" >
          </el-form-item>

        </el-form>
        <template slot="footer" class="dialog-footer">
          <el-button type="primary">确定</el-button>
        </template>
      </el-dialog>

      <div class="dialog-body">
        <el-row justify="end">
          <el-col :span="24">
            <el-button size="small" @click="showPatchAddForm">添加</el-button>
          </el-col>
        </el-row>

        <el-table border :data="patchTableData">
          <el-table-column prop="PATCH_VERSION" label="补丁版本" align="center"></el-table-column>
          <el-table-column prop="PATCH_DESCRIPTION" label="补丁描述" align="center"></el-table-column>
          <el-table-column prop="IS_ISSUE" label="是否下发" align="center"></el-table-column>
          <el-table-column prop="ISSUED_CONDITIONS" label="下发条件" align="center"></el-table-column>
          <el-table-column prop="PATCH_URL" label="补丁地址" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  props: ['channelPatchState', 'patchTableData'],
  data: function () {
    return {
      url: devConfig.dev.server,
      channelPatchForm: false,
      formLabelWidth: '120px',
      form: {
        version: '',
        desc: '',
        issue: '',
        condition: '',
        patchSoure: ''
      },
      selectedOptions: [],
      selectedOptions2: [],
      options: [
        {value: 'conRelease', label: '条件下发'},
        {value: 'grayRelease', label: '灰度下发', children: [{value: 'peopleNumber', label: '人数'}, {value: 'percentage', label: '百分比'}]},
        {value: 'allRelease', label: '全量下发'},
        {value: 'devRelease', label: '开发者下发'}
      ]
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    },
    closeDialog: function () {
      this.$emit('addPatchForm')
    },
    closeAddPatchForm: function () {
      this.channelPatchForm = false
    },
    showPatchAddForm: function () {
      this.channelPatchForm = true
    },
    addChannelPatch: function () {//添加渠道补丁
    }
  }
}
</script>
