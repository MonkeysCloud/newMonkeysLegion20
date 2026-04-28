import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apex — AI Orchestration Engine | MonkeysLegion',
  description: 'The first PHP framework with an AI orchestration engine built in. Multi-provider routing, declarative pipelines, guardrails, agent crews, and cost management.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
