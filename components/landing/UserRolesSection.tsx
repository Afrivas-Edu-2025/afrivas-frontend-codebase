"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedBeamDemo } from "../demo/animated-beam"
import {Feature108} from "@/components/effect-components/user-role-tabs"

export function UserRolesSection() {
  const [activeTab, setActiveTab] = useState("students")

  return (
      <div>
          <Feature108 />
          <AnimatedBeamDemo />
      </div>
    
  )
}