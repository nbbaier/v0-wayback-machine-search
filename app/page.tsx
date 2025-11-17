"use client"

import { Archive, Terminal, Table, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Archive className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">TimeVault</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your interface to explore the Internet Archive's Wayback Machine
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/minimal" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Terminal className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-center text-2xl">Minimal</CardTitle>
                <CardDescription className="text-center">
                  Clean, terminal-inspired interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Monospace typography</li>
                  <li>• Text-focused design</li>
                  <li>• Keyboard-first navigation</li>
                  <li>• Minimal distractions</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/table" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <Table className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-center text-2xl">Table</CardTitle>
                <CardDescription className="text-center">
                  Spreadsheet-style data view
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Sortable columns</li>
                  <li>• Compact rows</li>
                  <li>• Quick filtering</li>
                  <li>• Data-dense layout</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/timeline" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <CalendarDays className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-center text-2xl">Timeline</CardTitle>
                <CardDescription className="text-center">
                  Visual chronological journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Visual timeline layout</li>
                  <li>• Large preview cards</li>
                  <li>• Chronological flow</li>
                  <li>• Image-rich display</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Powered by Internet Archive's Wayback Machine</p>
        </footer>
      </div>
    </div>
  )
}
