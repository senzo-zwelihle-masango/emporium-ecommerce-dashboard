'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DocumentTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const DocumentTabs = ({ activeTab, onTabChange }: DocumentTabsProps) => {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default DocumentTabs
