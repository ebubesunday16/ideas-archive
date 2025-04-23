
export type IdeasType = {
    id?: number
    title: string
    main_keyword: string
    image_url: string
    search_volume: string
    headline: string
    excerpt: string
    created_at?: string
    keywords?: Array<{
      keyword: string
      volume: string
      competition: string
    }>
    notes?: Array<{
      title: string
      content: string
    }>
    market_analysis?: {
      search_volume: string
      competition_level: string
      trend: string
    }
    marketAnalysis?: {
        search_volume: string
        competition_level: string
        trend: string
    }
    implementation_steps?: Array<{
      title: string
      description: string
      order_index: number
    }>
    implementationSteps?: Array<{
        title: string
        description: string
        order_index: number
      }>
    competitors?: Array<{
      name: string
      url: string
      traffic: string
      traffic_share: number
      notes: string
    }>
    monetization_potential?: {
      subscription_revenue: string
      affiliate_revenue: string
      certification_programs: string
      enterprise_deals: string
      integration_partnerships: string
      ad_revenue: string
      total_potential: string
    }
    monetizationPotential?: {
        subscription_revenue: string
        affiliate_revenue: string
        certification_programs: string
        enterprise_deals: string
        integration_partnerships: string
        ad_revenue: string
        total_potential: string
      }
    technical_specs?: {
      development_cost: string
      timeline: string
      maintenance_cost: string
      tech_stack: string
    }

    technicalSpecs?: {
        development_cost: string
        timeline: string
        maintenance_cost: string
        tech_stack: string
      }
  }