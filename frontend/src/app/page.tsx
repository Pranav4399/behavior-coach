import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme'
import { Activity, AlignCenter, BarChart3, BrainCircuit, Clock, Cog, Compass, Fingerprint, Layers, LineChart, Lightbulb, MessageSquare, Puzzle, ScrollText, Sparkles, Split, Target, Users, UserCircle, Workflow } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-background via-background to-blue-50/30">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-full">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Behavior Coach</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild variant="default" className="rounded-full">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <main className="flex-1 w-full">
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-6 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">Behavioral Science Meets Digital Coaching</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Transform Workplace Behavior
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                A data-driven platform that combines behavioral science principles with personalized
                coaching to create lasting positive change in your workforce.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/dashboard">
                    <Compass className="mr-2 h-4 w-4" />
                    Explore Platform
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link href="/register">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Start Free Trial
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Abstract brain pattern background */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/50 filter blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500/50 filter blur-[100px]"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-violet-500/30 filter blur-[100px]"></div>
          </div>
        </section>
        
        {/* Key Benefits Section */}
        <section className="w-full py-16 bg-gradient-to-b from-blue-50/30 to-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Behavior Coach?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform leverages behavioral science to create measurable improvements in workplace behavior and wellbeing.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Targeted Segmentation</CardTitle>
                  <CardDescription>
                    Create dynamic worker segments based on role, performance, behavior, and custom attributes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Static and rule-based segmentation</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Real-time audience targeting</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Automated membership updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Workflow className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Behavioral Programs</CardTitle>
                  <CardDescription>
                    Deploy science-backed programs that drive measurable behavior change.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Journey-based interventions</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Progress tracking and reporting</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Customizable program templates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="space-y-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Impact Analytics</CardTitle>
                  <CardDescription>
                    Measure the effectiveness of your behavioral interventions with comprehensive analytics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Wellbeing assessment tracking</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>Performance correlation</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span>ROI measurement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Feature Overview */}
        <section className="w-full py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore the comprehensive tools available in the Behavior Coach platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <FeatureCard 
                icon={<Users className="h-5 w-5" />} 
                title="Worker Management" 
                description="Central repository for all worker profiles with customizable attributes."
              />
              <FeatureCard 
                icon={<Split className="h-5 w-5" />} 
                title="Dynamic Segmentation" 
                description="Create targeted worker groups using powerful rule builder."
              />
              <FeatureCard 
                icon={<Puzzle className="h-5 w-5" />} 
                title="Program Builder" 
                description="Design structured behavior change programs with journey mapping."
              />
              <FeatureCard 
                icon={<Lightbulb className="h-5 w-5" />} 
                title="Journey Blueprints" 
                description="Create reusable templates for your behavioral interventions."
              />
              <FeatureCard 
                icon={<MessageSquare className="h-5 w-5" />} 
                title="Touchpoint Manager" 
                description="Schedule and track engagement across multiple channels."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-5 w-5" />} 
                title="Wellbeing Tracking" 
                description="Monitor and analyze worker wellbeing indicators over time."
              />
              <FeatureCard 
                icon={<AlignCenter className="h-5 w-5" />} 
                title="Experiments" 
                description="Test different approaches and measure effectiveness."
              />
              <FeatureCard 
                icon={<Activity className="h-5 w-5" />} 
                title="Impact Analytics" 
                description="Comprehensive reporting on behavioral outcomes and ROI."
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="w-full py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workplace?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join organizations that use Behavior Coach to create measurable improvements in employee wellbeing, 
                engagement, and performance through science-backed behavioral interventions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="rounded-full px-8">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  <Link href="/contact">Request Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8 w-full bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <BrainCircuit className="h-3 w-3 text-white" />
                </div>
                <span className="font-bold text-sm">Behavior Coach</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Combining behavioral science with digital coaching to transform workplace behavior.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/science" className="text-muted-foreground hover:text-foreground transition-colors">Our Science</Link></li>
                <li><Link href="/case-studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Behavior Coach. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/40 border border-border/50 hover:border-primary/20 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
