"use client";

import {
	Archive,
	CalendarDays,
	LayoutGrid,
	Table,
	Terminal,
} from "lucide-react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-background gradient-bg grid-pattern flex items-center justify-center p-6">
			<div className="max-w-6xl w-full relative z-10">
				<div className="text-center mb-16">
					<div className="flex items-center justify-center gap-4 mb-6">
						<Archive className="h-16 w-16 text-primary" />
						<h1 className="text-6xl font-bold tracking-tight">TimeVault</h1>
					</div>
					<p className="text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
						Choose your interface to explore the Internet Archive's Wayback
						Machine
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					<Link href="/cards" className="group">
						<Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary hover:-translate-y-1 cursor-pointer bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-center mb-6">
									<div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
										<LayoutGrid className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
									</div>
								</div>
								<CardTitle className="text-center text-3xl mb-2">
									Cards
								</CardTitle>
								<CardDescription className="text-center text-base">
									Date-grouped card layout
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-sm text-muted-foreground space-y-2.5">
									<li>• One card per date</li>
									<li>• Grouped snapshots</li>
									<li>• Clean organization</li>
									<li>• Easy browsing</li>
								</ul>
							</CardContent>
						</Card>
					</Link>

					<Link href="/minimal" className="group">
						<Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-chart-2/20 hover:border-chart-2 hover:-translate-y-1 cursor-pointer bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-center mb-6">
									<div className="p-4 rounded-2xl bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
										<Terminal className="h-12 w-12 text-chart-2 group-hover:scale-110 transition-transform duration-300" />
									</div>
								</div>
								<CardTitle className="text-center text-3xl mb-2">
									Minimal
								</CardTitle>
								<CardDescription className="text-center text-base">
									Clean, distraction-free interface
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-sm text-muted-foreground space-y-2.5">
									<li>• Simple and elegant</li>
									<li>• Text-focused design</li>
									<li>• Refined typography</li>
									<li>• Minimal distractions</li>
								</ul>
							</CardContent>
						</Card>
					</Link>

					<Link href="/table" className="group">
						<Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-chart-3/20 hover:border-chart-3 hover:-translate-y-1 cursor-pointer bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-center mb-6">
									<div className="p-4 rounded-2xl bg-chart-3/10 group-hover:bg-chart-3/20 transition-colors">
										<Table className="h-12 w-12 text-chart-3 group-hover:scale-110 transition-transform duration-300" />
									</div>
								</div>
								<CardTitle className="text-center text-3xl mb-2">
									Table
								</CardTitle>
								<CardDescription className="text-center text-base">
									Spreadsheet-style data view
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-sm text-muted-foreground space-y-2.5">
									<li>• Sortable columns</li>
									<li>• Compact rows</li>
									<li>• Quick filtering</li>
									<li>• Data-dense layout</li>
								</ul>
							</CardContent>
						</Card>
					</Link>

					<Link href="/timeline" className="group">
						<Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-chart-4/20 hover:border-chart-4 hover:-translate-y-1 cursor-pointer bg-card/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-center mb-6">
									<div className="p-4 rounded-2xl bg-chart-4/10 group-hover:bg-chart-4/20 transition-colors">
										<CalendarDays className="h-12 w-12 text-chart-4 group-hover:scale-110 transition-transform duration-300" />
									</div>
								</div>
								<CardTitle className="text-center text-3xl mb-2">
									Timeline
								</CardTitle>
								<CardDescription className="text-center text-base">
									Visual chronological journey
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-sm text-muted-foreground space-y-2.5">
									<li>• Visual timeline layout</li>
									<li>• Large preview cards</li>
									<li>• Chronological flow</li>
									<li>• Image-rich display</li>
								</ul>
							</CardContent>
						</Card>
					</Link>
				</div>

				<footer className="mt-20 text-center text-sm text-muted-foreground">
					<p>Powered by Internet Archive's Wayback Machine</p>
				</footer>
			</div>
		</div>
	);
}
