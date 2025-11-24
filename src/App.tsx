import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, CheckCircle2, Download, FileText, FolderOpen, Share2, Shield, Sparkles, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type WorkflowStep = 'idle' | 'processing' | 'summary'
type AnalysisOption = {
  id: string
  name: string
  description: string
  highlight?: string
}

const analysisOptions: AnalysisOption[] = [
  {
    id: 'mobsf',
    name: 'MobSF',
    description: 'Comprehensive static + dynamic security analysis designed for APKs.',
    highlight: 'Required',
  },
  {
    id: 'mitmproxy',
    name: 'MITMProxy',
    description: 'Inspect network traffic to discover unsafe communication patterns.',
  },
  {
    id: 'androguard',
    name: 'AndroGuard',
    description: 'Deep dive into bytecode, certificates, and manifest hygiene.',
  },
  {
    id: 'frida',
    name: 'Frida',
    description: 'Runtime instrumentation & hook-based inspection for dynamic behavior.',
  },
  {
    id: 'drozer',
    name: 'Drozer',
    description: 'Advanced exploitation probes for research-grade assessments.',
  },
] as const

const recentAnalyses = [
  { name: 'retail-banking.apk', date: '2025-10-21', status: 'Completed', severity: 'Medium' },
  { name: 'social_network.apk', date: '2025-10-18', status: 'Completed', severity: 'Low' },
  { name: 'global-delivery.apk', date: '2025-10-16', status: 'Failed', severity: '—' },
]

const summaryTemplate = {
  generatedAt: 'October 21, 2025 · 10:45 AM',
  keyFindings: [
    'Improper thread synchronization identified in the payment service.',
    'Sensitive analytics payload exposed via unsecured WebSocket.',
    'Excessive permissions in manifest allow privilege escalation.',
  ],
  vulnerabilities: [
    {
      category: 'Race Condition',
      name: 'Inconsistent balance checks in payment module',
      severity: 'critical',
      scanner: 'MobSF',
    },
    {
      category: 'Improper Thread Synchronization',
      name: 'Analytics service spawns unbounded worker threads',
      severity: 'high',
      scanner: 'Frida',
    },
    {
      category: 'Runtime Exploit Surface',
      name: 'Broadcast receiver exported without auth',
      severity: 'medium',
      scanner: 'Drozer',
    },
  ],
  remediation: [
    {
      title: 'Race Condition Mitigation',
      action: 'Introduce optimistic locking combined with server-side verification before commits.',
    },
    {
      title: 'Secure Communications',
      action: 'Route analytics payloads through mTLS tunnel and rotate certificates quarterly.',
    },
    {
      title: 'Hardening Exported Components',
      action: 'Enforce signature-level permissions for exposed receivers and services.',
    },
  ],
  metrics: {
    duration: '08m 12s',
    severityScore: 7.4,
    coverage: '92%',
    riskLevel: 'High',
  },
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['mobsf'])
  const [step, setStep] = useState<WorkflowStep>('idle')
  const [progress, setProgress] = useState(0)

  const analysisReady = Boolean(file && selectedOptions.length)

  useEffect(() => {
    if (step !== 'processing') return
    setProgress(0)
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + Math.random() * 18)
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => setStep('summary'), 650)
        }
        return next
      })
    }, 650)
    return () => clearInterval(timer)
  }, [step])

  const summaryData = useMemo(() => summaryTemplate, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]
    if (nextFile) {
      setFile(nextFile)
    }
  }

  const toggleOption = (optionId: string) => {
    if (optionId === 'mobsf') {
      return
    }
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    )
  }

  const startAnalysis = () => {
    if (!analysisReady) return
    setDialogOpen(false)
    setStep('processing')
  }

  const resetWorkflow = () => {
    setProgress(0)
    setStep('idle')
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        <div className="absolute inset-y-0 right-0 -z-10 w-1/3 bg-[radial-gradient(circle,_rgba(255,255,255,0.05),_transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row">
        <aside className="glass-panel sticky top-10 hidden h-[calc(100vh-5rem)] w-64 flex-shrink-0 flex-col rounded-3xl p-6 lg:flex">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            MATS
          </div>
          <nav className="mt-10 space-y-2 text-sm text-muted-foreground">
            {['Overview', 'Upload', 'Analyses', 'Reports', 'Settings'].map((item) => (
              <button
                key={item}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 transition hover:text-foreground',
                  item === 'Upload' && 'bg-primary/10 text-foreground',
                )}
              >
                <span>{item}</span>
                {item === 'Upload' && <ArrowUpRight className="h-4 w-4" />}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-transparent p-4 text-sm">
            <p className="text-xs uppercase text-primary/70">Workspace health</p>
            <p className="mt-1 text-2xl font-semibold text-primary">98%</p>
            <p className="text-muted-foreground">All services operational</p>
          </div>
        </aside>

        <main className="flex-1 space-y-8 pb-12">
          <header className="glass-panel rounded-3xl p-8 text-center lg:text-left">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-primary/70">Mobile Application Threads Simulation</p>
                <h1 className="mt-2 text-3xl font-semibold lg:text-4xl">Upload and Analyze Your APK</h1>
                <p className="mt-3 text-base text-muted-foreground">
                  Combine static, dynamic, and runtime tooling in a single guided workflow powered by shadcn/ui.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Docs
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-white to-gray-300 text-primary-foreground hover:from-gray-200 hover:to-white">
                  <Sparkles className="h-4 w-4" />
                  Auto-remediate
                </Button>
              </div>
            </div>
          </header>

          <section className="glass-panel rounded-3xl p-8">
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Upload</p>
                <h2 className="mt-2 text-2xl font-semibold">Upload and Analyze Your APK</h2>
                <label
                  className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-secondary/30 p-10 text-center transition hover:border-primary/60"
                  htmlFor="apk-input"
                >
                  <Upload className="h-10 w-10 text-primary" />
                  <p className="mt-4 font-mono text-lg tracking-widest text-muted-foreground">upload_file</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop your APK file here or click to browse
                  </p>
                  <input
                    id="apk-input"
                    type="file"
                    accept=".apk"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  {file && (
                    <Badge variant="outline" className="mt-4 border-primary/60 bg-primary/5 text-sm text-primary">
                      {file.name}
                    </Badge>
                  )}
                </label>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="min-w-[160px]" disabled={!file}>
                        Analyze
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="text-xl font-semibold">Select Analysis Options</DialogTitle>
                      <DialogDescription>
                        Choose one or more tests to run on your application. MobSF is required for baseline coverage.
                      </DialogDescription>
                      <div className="mt-6 space-y-3">
                        {analysisOptions.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              'flex items-start justify-between rounded-2xl border border-border/70 p-4',
                              selectedOptions.includes(option.id) && 'border-primary/70 bg-primary/5',
                            )}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-base font-semibold">{option.name}</p>
                                {option.highlight && <Badge className="text-[11px]">{option.highlight}</Badge>}
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                            </div>
                            <Checkbox
                              checked={selectedOptions.includes(option.id)}
                              onCheckedChange={() => toggleOption(option.id)}
                              disabled={option.id === 'mobsf'}
                            />
                          </div>
                        ))}
                      </div>
                      <Button className="mt-6 w-full" disabled={!analysisReady} onClick={startAnalysis}>
                        Run Analysis
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" className="gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    Live device farm
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/60 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Recent Analyses</p>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.name} className="rounded-2xl border border-border/40 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{analysis.name}</p>
                          <p className="text-xs text-muted-foreground">{analysis.date}</p>
                        </div>
                        <Badge variant={analysis.status === 'Failed' ? 'destructive' : 'success'}>{analysis.status}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Severity: <span className="font-semibold text-foreground">{analysis.severity}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="rounded-2xl bg-gradient-to-br from-white/15 to-transparent p-4">
                  <p className="text-sm text-primary/80">Need deeper insight?</p>
                  <p className="text-base font-semibold">Export a forensic-ready PDF.</p>
                  <Button variant="outline" className="mt-3 w-full border-primary/50 text-primary">
                    Quick Export
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-border/40 bg-card/60 p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">Analysis Summary</p>
                <h2 className="text-3xl font-semibold">{file ? `${file.name.replace('.apk', '')}.apk` : 'Your APK'}</h2>
                <p className="text-sm text-muted-foreground">{summaryData.generatedAt}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Detailed PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Report
                </Button>
              </div>
            </div>

            {step !== 'summary' ? (
              <div className="rounded-3xl border border-dashed border-border/60 p-10 text-center text-muted-foreground">
                Your results will appear here after the analysis completes. Select your scanners and run the workflow to
                unlock findings, vulnerabilities, and remediation plans.
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                  <Card className="glass-panel border-border/60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Key Findings
                      </CardTitle>
                      <CardDescription>Automated insights across static, dynamic, and runtime scans.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {summaryData.keyFindings.map((finding) => (
                        <div key={finding} className="flex items-start gap-4 rounded-2xl border border-border/50 p-4">
                          <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                          <p className="text-sm text-muted-foreground">{finding}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass-panel border-border/60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Shield className="h-5 w-5 text-primary" />
                        Vulnerabilities Found
                      </CardTitle>
                      <CardDescription>Prioritized list merged from MobSF, Frida, and Drozer outputs.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                      {summaryData.vulnerabilities.map((vuln) => (
                        <div key={vuln.name} className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                          <Badge
                            variant={vuln.severity === 'critical' ? 'destructive' : vuln.severity === 'high' ? 'warning' : 'outline'}
                            className="text-[11px]"
                          >
                            {vuln.severity.toUpperCase()}
                          </Badge>
                          <p className="mt-3 text-sm font-semibold text-foreground">{vuln.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{vuln.category}</p>
                          <p className="mt-4 text-xs text-muted-foreground">Source · {vuln.scanner}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="glass-panel border-border/60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        Remediation Suggestions
                      </CardTitle>
                      <CardDescription>Actionable next steps mapped to MATS knowledge base.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {summaryData.remediation.map((item) => (
                        <div key={item.title} className="rounded-2xl border border-border/50 p-4">
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{item.action}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="glass-panel border-border/60">
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                      <CardDescription>Composite scoring across all selected scanners.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl border border-border/60 p-4 text-center">
                        <p className="text-sm text-muted-foreground">Severity Score</p>
                        <p className="mt-2 text-4xl font-semibold">{summaryData.metrics.severityScore}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">High risk</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total duration</span>
                          <strong className="text-foreground">{summaryData.metrics.duration}</strong>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Coverage</span>
                          <strong className="text-foreground">{summaryData.metrics.coverage}</strong>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Risk posture</span>
                          <strong className="text-foreground">{summaryData.metrics.riskLevel}</strong>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">MobSF stack</p>
                        <Progress value={92} />
                        <p className="text-xs text-muted-foreground">
                          Analyzer confidence improves as more baseline scans complete.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                      <Button className="w-full gap-2">
                        <Share2 className="h-4 w-4" />
                        Sync to Jira
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Open workspace
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="glass-panel border-border/60">
                    <CardHeader>
                      <CardTitle>Activity</CardTitle>
                      <CardDescription>Timeline of automated steps.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ScrollArea className="h-64 pr-2">
                        <div className="space-y-4 text-sm">
                          {[
                            'MobSF static scan completed · 02:12',
                            'MITMProxy captured 38 sessions · 03:04',
                            'Frida runtime scripts executed · 04:45',
                            'Drozer exploit surface audit finished · 06:18',
                            'PDF report assembled · 08:05',
                          ].map((entry) => (
                            <div key={entry} className="rounded-2xl border border-border/40 p-3 text-muted-foreground">
                              {entry}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {step === 'processing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <Card className="w-full max-w-lg space-y-6 border-primary/40 p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-semibold">Analysis in Progress</h3>
              <p className="text-sm text-muted-foreground">Analyzing threads… {Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground">Tip: Regular analyses help identify bottlenecks early.</p>
            <Button variant="ghost" className="w-full border border-border/60" onClick={resetWorkflow}>
              Cancel analysis
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App

