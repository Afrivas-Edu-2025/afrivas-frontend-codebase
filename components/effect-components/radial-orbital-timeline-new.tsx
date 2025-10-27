'use client';  // Add this if the component uses hooks, events, or browser APIs (highly recommended for timelines/animations)

import { Calendar, FileText /* etc. */ } from 'lucide-react';  // Import icons here if not passed dynamically
import { motion /* other imports */ } from 'framer-motion';

interface TimelineItem {
  id: number;
  title: string;
  // ... other props from your timelineData
  icon: React.ComponentType;  // Type for icon components
}

interface Props {
  timelineData: TimelineItem[];
}

const RadialOrbitalTimeline = ({ timelineData }: Props) => {
  return (
    <div className="your-timeline-wrapper">
      {timelineData.map((item) => {
        const Icon = item.icon;  // Key: Assign to capitalized var for dynamic JSX
        return (
          <motion.div key={item.id} /* your animations */>
            <Icon size={24} /* props for lucide icons */ />
            {/* rest of item render */}
          </motion.div>
        );
      })}
    </div>
  );
};

export default RadialOrbitalTimeline;  // Must be default export of the function