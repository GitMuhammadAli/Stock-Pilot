"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, AlertTriangle, Target, Zap, BarChart3, PieChart, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function PredictiveAnalytics() {
  const [selectedModel, setSelectedModel] = useState("demand")

  const predictiveData = {
    demand: {
      accuracy: 94,
      predictions: [
        { product: "Wireless Headphones Pro", current: 150, predicted: 89, confidence: 96, trend: "down" },
        { product: "Bluetooth Speaker Mini", current: 200, predicted: 245, confidence: 92, trend: "up" },
        { product: "Office Chair", current: 25, predicted: 18, confidence: 88, trend: "down" },
        { product: "Laptop Stand", current: 75, predicted: 95, confidence: 91, trend: "up" },
      ],
      insights: [
        "Holiday season approaching - expect 25% increase in electronics",
        "Office furniture demand declining due to remote work trends",
        "Audio products showing strong growth pattern",
      ],
    },
    stockout: {
      accuracy: 89,
      risks: [
        { product: "LED Desk Lamp", risk: 95, days: 3, impact: "High", reason: "Low current stock + high demand" },
        { product: "USB-C Hub", risk: 78, days: 7, impact: "Medium", reason: "Supplier delay expected" },
        { product: "Wireless Mouse", risk: 45, days: 14, impact: "Low", reason: "Seasonal demand increase" },
      ],
      prevention: [
        "Immediate reorder recommended for LED Desk Lamp",
        "Contact backup supplier for USB-C Hub",
        "Monitor Wireless Mouse demand closely",
      ],
    },
    optimization: {
      accuracy: 91,
      opportunities: [
        { category: "Overstock Reduction", savings: 45000, effort: "Medium", timeline: "2 weeks" },
        { category: "Reorder Point Optimization", savings: 23000, effort: "Low", timeline: "1 week" },
        { category: "Supplier Consolidation", savings: 67000, effort: "High", timeline: "2 months" },
        { category: "Warehouse Redistribution", savings: 34000, effort: "Medium", timeline: "3 weeks" },
      ],
      totalSavings: 169000,
    },
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-500"
    if (confidence >= 80) return "text-yellow-500"
    return "text-red-500"
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "bg-red-500"
    if (risk >= 60) return "bg-orange-500"
    if (risk >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Low":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-[#1C2333] border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#B6F400] flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            AI-Powered Predictive Analytics
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              <Activity className="h-3 w-3 mr-1" />
              Models Active
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Last Updated: 2 min ago</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedModel} onValueChange={setSelectedModel} className="w-full">
          <TabsList className="bg-[#2C3444] border-none mb-6 grid grid-cols-3">
            <TabsTrigger value="demand" className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]">
              Demand Forecasting
            </TabsTrigger>
            <TabsTrigger
              value="stockout"
              className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
            >
              Stockout Prevention
            </TabsTrigger>
            <TabsTrigger
              value="optimization"
              className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
            >
              Cost Optimization
            </TabsTrigger>
          </TabsList>

          {/* Demand Forecasting */}
          <TabsContent value="demand" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2C3444] p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-[#B6F400]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">30-Day Demand Forecast</h3>
                    <p className="text-sm text-gray-400">AI model accuracy: {predictiveData.demand.accuracy}%</p>
                  </div>
                </div>
                <Progress value={predictiveData.demand.accuracy} className="w-32 h-2" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">Product Predictions</h4>
                  {predictiveData.demand.predictions.map((prediction, index) => (
                    <motion.div
                      key={prediction.product}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#2C3444] p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-white">{prediction.product}</h5>
                        <Badge className={`${prediction.trend === "up" ? "bg-green-500" : "bg-red-500"} text-white`}>
                          {prediction.trend === "up" ? "↗" : "↘"} {prediction.trend}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Current:</span>
                          <div className="text-white font-medium">{prediction.current}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Predicted:</span>
                          <div className="text-white font-medium">{prediction.predicted}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Confidence:</span>
                          <div className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                            {prediction.confidence}%
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">AI Insights</h4>
                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="space-y-3">
                      {predictiveData.demand.insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="bg-[#B6F400]/10 p-2 rounded-full mt-0.5">
                            <Zap className="h-3 w-3 text-[#B6F400]" />
                          </div>
                          <p className="text-sm text-gray-300">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-white mb-3">Forecast Accuracy Trend</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">This Month</span>
                        <span className="text-green-500">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Last Month</span>
                        <span className="text-green-500">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">3 Months Ago</span>
                        <span className="text-yellow-500">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Stockout Prevention */}
          <TabsContent value="stockout" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2C3444] p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Stockout Risk Analysis</h3>
                    <p className="text-sm text-gray-400">
                      Prevention model accuracy: {predictiveData.stockout.accuracy}%
                    </p>
                  </div>
                </div>
                <Progress value={predictiveData.stockout.accuracy} className="w-32 h-2" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">High-Risk Products</h4>
                  {predictiveData.stockout.risks.map((risk, index) => (
                    <motion.div
                      key={risk.product}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#2C3444] p-4 rounded-lg border-l-4 border-red-500"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-white">{risk.product}</h5>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getRiskColor(risk.risk)} text-white`}>{risk.risk}% Risk</Badge>
                          <Badge variant="outline" className="border-gray-500 text-gray-300">
                            {risk.days} days
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Business Impact:</span>
                          <span
                            className={`font-medium ${
                              risk.impact === "High"
                                ? "text-red-500"
                                : risk.impact === "Medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          >
                            {risk.impact}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300">{risk.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">Recommended Actions</h4>
                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="space-y-4">
                      {predictiveData.stockout.prevention.map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-[#1C2333] rounded-lg"
                        >
                          <div className="bg-[#B6F400]/10 p-2 rounded-full mt-0.5">
                            <Target className="h-3 w-3 text-[#B6F400]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">{action}</p>
                            <Button size="sm" className="mt-2 bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
                              Take Action
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-white mb-3">Prevention Success Rate</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Stockouts Prevented</span>
                        <span className="text-sm font-medium text-green-500">23 this month</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Cost Savings</span>
                        <span className="text-sm font-medium text-[#B6F400]">$45,600</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Customer Satisfaction</span>
                        <span className="text-sm font-medium text-blue-500">98.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Cost Optimization */}
          <TabsContent value="optimization" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#2C3444] p-3 rounded-lg">
                    <PieChart className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Cost Optimization Opportunities</h3>
                    <p className="text-sm text-gray-400">
                      Potential savings: ${predictiveData.optimization.totalSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-500">
                    ${(predictiveData.optimization.totalSavings / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400">Annual Savings</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">Optimization Opportunities</h4>
                  {predictiveData.optimization.opportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#2C3444] p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-white">{opportunity.category}</h5>
                        <div className="text-lg font-bold text-green-500">
                          ${(opportunity.savings / 1000).toFixed(0)}K
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Effort Level:</span>
                          <Badge className={`ml-2 ${getEffortColor(opportunity.effort)} text-white`}>
                            {opportunity.effort}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-gray-400">Timeline:</span>
                          <span className="text-white ml-2">{opportunity.timeline}</span>
                        </div>
                      </div>

                      <Button size="sm" className="mt-3 w-full bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
                        Start Optimization
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-white">Implementation Roadmap</h4>
                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          1
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Quick Wins (1-2 weeks)</div>
                          <div className="text-xs text-gray-400">Reorder Point Optimization - $23K savings</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          2
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Medium Term (2-4 weeks)</div>
                          <div className="text-xs text-gray-400">Overstock & Redistribution - $79K savings</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          3
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Long Term (2+ months)</div>
                          <div className="text-xs text-gray-400">Supplier Consolidation - $67K savings</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-white mb-3">ROI Projection</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Month 1:</span>
                        <span className="text-green-500">$23,000</span>
                      </div>
                      <Progress value={14} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Month 3:</span>
                        <span className="text-green-500">$102,000</span>
                      </div>
                      <Progress value={60} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Month 6:</span>
                        <span className="text-green-500">$169,000</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
