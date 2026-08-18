import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/civic/Header";
import { Info, ShieldCheck, Zap, HeartHandshake, Eye, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: any;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white dark:bg-[#0F1A2E] rounded-[24px] border border-[#E2E8F0] dark:border-[#1B2B48] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-[#EEF2FF] dark:bg-[#1E3A8A]/30 flex items-center justify-center mb-5">
                <Icon className="h-6 w-6 text-[#001F5C] dark:text-[#38BDF8]" strokeWidth={2.2} />
            </div>
            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {title}
            </h3>
            <p className="text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {description}
            </p>
        </div>
    );
}

function AboutPage() {
    return (
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#060F1E] text-slate-900 dark:text-white flex flex-col">
            <Header />

            <main className="flex-1 overflow-y-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-[#0A192F] py-20 lg:py-28">
                    <div className="absolute inset-0">
                        <svg
                            className="absolute h-full w-full opacity-30"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="bg-grad-about" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#1E3A8A" />
                                    <stop offset="100%" stopColor="#0F172A" />
                                </linearGradient>
                            </defs>
                            <rect width="100" height="100" fill="url(#bg-grad-about)" />
                            <path d="M 0 100 L 100 30 L 100 100 Z" fill="#0EA5E9" opacity="0.1" />
                            <path d="M 0 100 L 100 60 L 100 100 Z" fill="#3B82F6" opacity="0.1" />
                        </svg>
                    </div>

                    <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 mb-8 backdrop-blur-md shadow-2xl">
                            <Info className="h-10 w-10 text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight text-balance mb-6">
                            Empowering Citizens,<br className="hidden sm:block" />
                            Transforming Cities
                        </h1>
                        <p className="mx-auto max-w-2xl text-[17px] md:text-[19px] text-white/80 font-medium leading-relaxed mb-10">
                            NagarX is a next-generation civic triage platform designed to bridge the gap between citizens
                            and municipal authorities. We believe in transparent, accountable, and highly responsive local governance.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0A192F] hover:bg-slate-100 px-8 py-3.5 text-[15px] font-bold shadow-lg transition-all"
                            >
                                Explore Dashboard
                                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.3} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-20 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight mb-6">Our Mission</h2>
                            <p className="text-[16px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                Cities grow rapidly, and managing civic infrastructure demands an immense amount of coordination.
                                Traditional reporting methods often leave citizens in the dark and authorities overwhelmed by unstructured data.
                            </p>
                            <p className="text-[16px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                NagarX sets out to solve this by providing a <strong className="text-slate-900 dark:text-white">transparent and crowdsourced problem tracking system</strong>.
                                By utilizing community voting, live heatmaps, and streamlined authority workflows, we ensure that critical issues
                                are prioritized and resolved rapidly.
                            </p>
                        </div>
                        <div className="relative rounded-[24px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video flex items-center justify-center">
                            <img src="/about-illustration.jpg" alt="NagarX Civic Illustration" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-4">Core Principles</h2>
                        <p className="text-[16px] text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                            Built from the ground up to ensure efficiency, transparency, and accountability at every stage of the civic pipeline.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Eye}
                            title="Absolute Transparency"
                            description="Track grievances from when they are reported to their final resolution, with public updates and timelines."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Verified Resolutions"
                            description="Authorities must upload photographic proof of the completed work to close any civic issue."
                        />
                        <FeatureCard
                            icon={HeartHandshake}
                            title="Participatory Budgeting"
                            description="Citizens have a direct say in how municipal or campus funds are allocated for new infrastructure."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Rapid Action"
                            description="Intelligent filtering and upvoting guarantees that the most urgent community needs are prioritised instantly."
                        />
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-[#0B1526] border-t border-slate-200 dark:border-slate-800 py-12 text-center">
                    <p className="text-[14px] text-slate-400 font-medium">
                        © {new Date().getFullYear()} NagarX Civic Solutions. All rights reserved.
                    </p>
                    <p className="text-[13px] text-slate-400 font-medium mt-1">
                        Your Voice • Our Responsibility
                    </p>
                </footer>
            </main>
        </div>
    );
}
