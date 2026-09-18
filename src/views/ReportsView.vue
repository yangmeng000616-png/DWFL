<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-bold text-white tracking-wide">报表中心 · 算力中心智能安全态势合规报告</h2>
          <p class="text-xs text-slate-400">基于国家标准 (GB 50057) 与国际电工委员会 (IEC 62305) 自动生成周期性运行与防护测评审计书</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="openReportPreview(reports[0])"
          class="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>预览本期综合合规报表</span>
        </button>
      </div>
    </div>

    <!-- 3 Pre-built Report Templates -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="rep in reports"
        :key="rep.id"
        class="tech-panel tech-panel-hover rounded-xl p-4 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-white">{{ rep.title }}</span>
            <span class="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {{ rep.status }}
            </span>
          </div>
          <p class="text-xs text-slate-300 mt-2.5 leading-relaxed">{{ rep.desc }}</p>

          <div class="mt-3 bg-[#06173a] p-2.5 rounded-lg border border-[#143c77] text-[11px] space-y-1">
            <div class="flex justify-between text-slate-400">
              <span>覆盖防护对象:</span>
              <span class="text-cyan-300">{{ rep.scope }}</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>国家标准符合性:</span>
              <span class="text-emerald-400 font-semibold">{{ rep.compliance }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-[#1b3d75]/50 flex items-center justify-between text-xs">
          <span class="text-xs text-slate-400">生成周期: {{ rep.period }}</span>
          <div class="flex items-center gap-2">
            <button
              @click="openReportPreview(rep)"
              class="px-2.5 py-1 rounded bg-[#0d2a58] hover:bg-[#133d7c] text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              数据预览
            </button>
            <button
              @click="downloadReport(rep)"
              class="px-2.5 py-1 rounded bg-[#10356e] hover:bg-[#184d9e] text-white border border-cyan-400/50 transition-colors flex items-center gap-1"
            >
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>导出报告</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- National Standards Compliance Card -->
    <div class="tech-panel rounded-xl p-5">
      <div class="flex items-center justify-between pb-3 border-b border-[#1b3d75]/50">
        <h3 class="text-sm font-bold text-white tracking-wide">
          国家与国际防雷标准符合性自检指数 (GB 50057 / IEC 62305)
        </h3>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-[#00e5a3] border border-emerald-500/50">
          合规总分: 99.4 分 (优级)
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
        <div class="bg-[#081b3c] p-3.5 rounded-xl border border-[#173a6a] flex flex-col justify-between">
          <div class="text-slate-400 text-xs">地网接地电阻规范 (&lt; 1.0Ω)</div>
          <div class="text-2xl font-bold font-tech text-emerald-400 mt-2 glow-text-green">0.52 Ω</div>
          <div class="text-[11px] text-slate-300 mt-1 flex justify-between">
            <span>安全裕度: 48%</span>
            <span class="text-emerald-400 font-semibold">100% 达标</span>
          </div>
        </div>

        <div class="bg-[#081b3c] p-3.5 rounded-xl border border-[#173a6a] flex flex-col justify-between">
          <div class="text-slate-400 text-xs">SPD 浪涌泄放全级联防护协同</div>
          <div class="text-2xl font-bold font-tech text-cyan-300 mt-2 glow-text-cyan">12/12 级联有效</div>
          <div class="text-[11px] text-slate-300 mt-1 flex justify-between">
            <span>压敏温升: &lt; 38℃</span>
            <span class="text-cyan-300 font-semibold">零劣化超标</span>
          </div>
        </div>

        <div class="bg-[#081b3c] p-3.5 rounded-xl border border-[#173a6a] flex flex-col justify-between">
          <div class="text-slate-400 text-xs">防静电地板及人体放电电位 (&lt;100V)</div>
          <div class="text-2xl font-bold font-tech text-teal-300 mt-2 glow-text-cyan">&lt; 25 V</div>
          <div class="text-[11px] text-slate-300 mt-1 flex justify-between">
            <span>机房微环境离子平衡度</span>
            <span class="text-teal-300 font-semibold">优级合规</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Preview Modal -->
    <div
      v-if="activePreviewReport"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
      @click.self="activePreviewReport = null"
    >
      <div class="w-full max-w-3xl bg-[#061536] border border-cyan-400/80 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Top bar -->
        <div class="px-6 py-4 bg-gradient-to-r from-[#0b2452] to-[#061536] border-b border-cyan-500/40 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
              <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">报告在线预览 · {{ activePreviewReport.title }}</h3>
              <p class="text-xs text-slate-400 font-tech">编号: RPT-2025-0429 · 格式: GB/T 21431-2015 建筑防雷装置检测规范</p>
            </div>
          </div>
          <button
            @click="activePreviewReport = null"
            class="w-8 h-8 rounded-lg bg-[#0e2c60] hover:bg-[#184898] text-slate-300 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <!-- Document Sheet -->
        <div class="p-6 overflow-y-auto space-y-4 text-xs">
          <!-- Document Header Box -->
          <div class="bg-[#091e45] p-4 rounded-xl border border-[#1a4785] flex items-center justify-between">
            <div>
              <div class="text-sm font-bold text-white">受检单位: 智算集群算力数据中心 (AIDC-01)</div>
              <div class="text-xs text-slate-400 mt-1">检测单位: 工业安全与电磁防护国家重点实验室智慧监测分中心</div>
            </div>
            <div class="text-right font-tech">
              <div class="text-xl font-bold text-[#00e5a3]">99.4 分</div>
              <div class="text-xs text-slate-400">综合安全评估等级: A+</div>
            </div>
          </div>

          <!-- Section 1: 监测统计表 -->
          <div class="bg-[#081838] p-4 rounded-xl border border-[#153a6e]">
            <h4 class="text-xs font-bold text-cyan-300 mb-2">一、防御系统截获与环境特征统计摘要</h4>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-slate-400 border-b border-[#1b3d75]/60 pb-1">
                  <th class="py-1">监测维度</th>
                  <th class="py-1">实测指标均值</th>
                  <th class="py-1">国标规范极值</th>
                  <th class="py-1 text-right">符合性判定</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#132e58]/40">
                <tr>
                  <td class="py-1.5 text-white">大气电场先导强度</td>
                  <td class="py-1.5 font-tech text-cyan-300">12.4 kV/m</td>
                  <td class="py-1.5 text-slate-400">阈值 30.0 kV/m</td>
                  <td class="py-1.5 text-right text-emerald-400 font-semibold">合格</td>
                </tr>
                <tr>
                  <td class="py-1.5 text-white">直接雷击瞬态截获电流</td>
                  <td class="py-1.5 font-tech text-cyan-300">58.7 kA (单次泄放)</td>
                  <td class="py-1.5 text-slate-400">耐受极值 100 kA</td>
                  <td class="py-1.5 text-right text-emerald-400 font-semibold">合格 (100% 泄流)</td>
                </tr>
                <tr>
                  <td class="py-1.5 text-white">综合接地网接地电阻</td>
                  <td class="py-1.5 font-tech text-emerald-300">0.52 Ω</td>
                  <td class="py-1.5 text-slate-400">&lt; 1.0 Ω</td>
                  <td class="py-1.5 text-right text-emerald-400 font-semibold">优级达标</td>
                </tr>
                <tr>
                  <td class="py-1.5 text-white">智能SPD设备在网完好率</td>
                  <td class="py-1.5 font-tech text-cyan-300">12 / 12 (100%)</td>
                  <td class="py-1.5 text-slate-400">&gt; 95%</td>
                  <td class="py-1.5 text-right text-emerald-400 font-semibold">优级达标</td>
                </tr>
                <tr>
                  <td class="py-1.5 text-white">防静电地板表面泄漏电阻</td>
                  <td class="py-1.5 font-tech text-cyan-300">1.8 × 10⁶ Ω</td>
                  <td class="py-1.5 text-slate-400">1.0 × 10⁵ ~ 1.0 × 10⁹ Ω</td>
                  <td class="py-1.5 text-right text-emerald-400 font-semibold">优级达标</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 2: 审计结论与运维建议 -->
          <div class="bg-[#081838] p-4 rounded-xl border border-[#153a6e]">
            <h4 class="text-xs font-bold text-cyan-300 mb-1.5">二、总体防御评价与主动运维建议</h4>
            <p class="text-slate-300 text-xs leading-relaxed">
              本周期内，算力中心双流向主动防雷系统、全天候大气电场探针与星型联合接地系统运行平稳可靠，未发生雷击跳闸或地电位反击烧毁服务器事件。针对 2F 低压配电室 A-02 柜 SPD 压敏电阻漏电流上升至 18.2µA 的预警情况，建议于下周机房例行窗口执行预防性器件更换。
            </p>
          </div>

          <!-- Action bar -->
          <div class="flex items-center justify-between pt-2">
            <span class="text-slate-400 text-xs">电子防伪验证码: SHA256:7f4a2b9e81...</span>
            <div class="flex items-center gap-2">
              <button
                @click="downloadReport(activePreviewReport)"
                class="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1872f6] to-[#0091ff] text-white font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(24,114,246,0.6)]"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>立即下载该报告 (PDF)</span>
              </button>
              <button
                @click="activePreviewReport = null"
                class="px-4 py-2 rounded-lg bg-[#142646] hover:bg-[#1f3760] text-slate-200"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ReportDoc {
  id: string;
  title: string;
  desc: string;
  status: string;
  period: string;
  scope: string;
  compliance: string;
}

const reports = ref<ReportDoc[]>([
  {
    id: 'RPT-01',
    title: '2025年4月份防雷与电磁安全运行月报',
    desc: '全面汇总全月捕获的直接雷击泄放、浪涌过电压动作、接地网阻值演变及微环境静电控制综合档案。',
    status: '最新归档',
    period: '每月1日出具',
    scope: '全域 5 大系统 / 37 台传感器',
    compliance: 'GB 50057-2010 (99.4分)'
  },
  {
    id: 'RPT-02',
    title: '算力中心关键设施 SPD 寿命周期评估报告',
    desc: '针对12台智能SPD器件劣化参数、压敏温升及动作计数进行寿命衰老预测及预防性维保工单推荐。',
    status: '就绪可导',
    period: '双周度自动更新',
    scope: '高低压配电室 12 台智能SPD',
    compliance: 'IEC 61643-11 标准 (优)'
  },
  {
    id: 'RPT-03',
    title: '静电环境控制与微电子防护合规性审计书',
    desc: '机房防静电地板泄漏阻抗、作业人员腕带接地在线回路及微环境离子风机除静电衰减效能深度测评。',
    status: '合规通过',
    period: '季度法定测评',
    scope: '主机房 A/B/C 三大算力区',
    compliance: 'SJ/T 10694 防静电规范'
  }
]);

const activePreviewReport = ref<ReportDoc | null>(null);

const openReportPreview = (rep: ReportDoc) => {
  activePreviewReport.value = rep;
};

const downloadReport = (rep: ReportDoc) => {
  // Generate downloadable formatted report file
  const content = `===============================================================
算力中心雷电静电智能监测与防护平台 · 审计合规报告
===============================================================
报告名称: ${rep.title}
报告编号: RPT-AIDC-${new Date().toISOString().slice(0, 10)}
生成时间: ${new Date().toLocaleString()}
受检单位: 智算集群算力数据中心 (AIDC-01)
审计范围: ${rep.scope}
合规标准: ${rep.compliance}
合规得分: 99.4 分 (优级)

【核心技术指标汇总】
1. 大气电场强度: 12.4 kV/m (正常平稳)
2. 直接雷击拦截峰值: 58.7 kA (双流向主动防雷消能泄放正常)
3. 联合接地网阻抗: 0.52 Ω (标准 ≤ 1.0 Ω, 优级合规)
4. 智能SPD完好率: 12/12 100% 在线
5. 机房静电残余电位: < 25 V (标准 < 100V, 优级合规)

【审计结论】
系统整体运行状态优良，建筑防雷、内部等电位均压、静电微环境各项指标均达到国家与行业最高标准。
===============================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${rep.title}_${new Date().toISOString().slice(0, 10)}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>
