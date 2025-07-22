"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, DollarSign, TrendingUp, Package, Target, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function AdvancedCalculator() {
  const [costSavingInputs, setCostSavingInputs] = useState({
    currentValue: "100000",
    targetReduction: "15",
    carryingCost: "25",
  })

  const [reorderInputs, setReorderInputs] = useState({
    demandRate: "100",
    leadTime: "7",
    safetyStock: "20",
    orderCost: "50",
    holdingCost: "5",
  })

  const [roiInputs, setRoiInputs] = useState({
    initialInvestment: "50000",
    annualSavings: "15000",
    implementationCost: "5000",
  })

  const [results, setResults] = useState({
    costSaving: { savings: 15000, newValue: 85000, annualSaving: 3750 },
    reorder: { reorderPoint: 720, eoq: 447, totalCost: 2236 },
    roi: { roi: 200, paybackPeriod: 3.67, npv: 25000 },
  })

  const calculateCostSaving = () => {
    const currentValue = Number.parseFloat(costSavingInputs.currentValue) || 0
    const targetReduction = Number.parseFloat(costSavingInputs.targetReduction) || 0
    const carryingCost = Number.parseFloat(costSavingInputs.carryingCost) || 0

    const savings = (currentValue * targetReduction) / 100
    const newValue = currentValue - savings
    const annualSaving = (savings * carryingCost) / 100

    setResults((prev) => ({
      ...prev,
      costSaving: { savings, newValue, annualSaving },
    }))
  }

  const calculateReorderPoint = () => {
    const demandRate = Number.parseFloat(reorderInputs.demandRate) || 0
    const leadTime = Number.parseFloat(reorderInputs.leadTime) || 0
    const safetyStock = Number.parseFloat(reorderInputs.safetyStock) || 0
    const orderCost = Number.parseFloat(reorderInputs.orderCost) || 0
    const holdingCost = Number.parseFloat(reorderInputs.holdingCost) || 0

    const reorderPoint = demandRate * leadTime + safetyStock
    const eoq = Math.sqrt((2 * demandRate * 365 * orderCost) / holdingCost)
    const totalCost = Math.sqrt(2 * demandRate * 365 * orderCost * holdingCost)

    setResults((prev) => ({
      ...prev,
      reorder: { reorderPoint, eoq: Math.round(eoq), totalCost: Math.round(totalCost) },
    }))
  }

  const calculateROI = () => {
    const initialInvestment = Number.parseFloat(roiInputs.initialInvestment) || 0
    const annualSavings = Number.parseFloat(roiInputs.annualSavings) || 0
    const implementationCost = Number.parseFloat(roiInputs.implementationCost) || 0

    const totalInvestment = initialInvestment + implementationCost
    const roi = ((annualSavings * 3 - totalInvestment) / totalInvestment) * 100
    const paybackPeriod = totalInvestment / annualSavings
    const npv = annualSavings * 3 - totalInvestment

    setResults((prev) => ({
      ...prev,
      roi: { roi: Math.round(roi), paybackPeriod: Math.round(paybackPeriod * 100) / 100, npv },
    }))
  }

  return (
    <Card className="bg-[#1C2333] border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#B6F400] flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Advanced Inventory Calculators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cost-saving" className="w-full">
          <TabsList className="bg-[#2C3444] border-none mb-6 grid grid-cols-3">
            <TabsTrigger
              value="cost-saving"
              className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
            >
              Cost Optimization
            </TabsTrigger>
            <TabsTrigger
              value="reorder"
              className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]"
            >
              Reorder Calculator
            </TabsTrigger>
            <TabsTrigger value="roi" className="data-[state=active]:bg-[#B6F400] data-[state=active]:text-[#0B0F1A]">
              ROI Analysis
            </TabsTrigger>
          </TabsList>

          {/* Cost Saving Calculator */}
          <TabsContent value="cost-saving" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                  Input Parameters
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Current Inventory Value ($)</Label>
                    <Input
                      type="number"
                      value={costSavingInputs.currentValue}
                      onChange={(e) => setCostSavingInputs((prev) => ({ ...prev, currentValue: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Target Reduction (%)</Label>
                    <Input
                      type="number"
                      value={costSavingInputs.targetReduction}
                      onChange={(e) => setCostSavingInputs((prev) => ({ ...prev, targetReduction: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Annual Carrying Cost (%)</Label>
                    <Input
                      type="number"
                      value={costSavingInputs.carryingCost}
                      onChange={(e) => setCostSavingInputs((prev) => ({ ...prev, carryingCost: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <Button
                    onClick={calculateCostSaving}
                    className="w-full bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Savings
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-[#B6F400]" />
                  Results
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      ${results.costSaving.savings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">One-time Inventory Reduction</div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#B6F400]">
                      ${results.costSaving.annualSaving.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Annual Carrying Cost Savings</div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white">${results.costSaving.newValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Optimized Inventory Value</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Reorder Point Calculator */}
          <TabsContent value="reorder" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Package className="mr-2 h-5 w-5 text-blue-500" />
                  Inventory Parameters
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Daily Demand Rate (units)</Label>
                    <Input
                      type="number"
                      value={reorderInputs.demandRate}
                      onChange={(e) => setReorderInputs((prev) => ({ ...prev, demandRate: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Lead Time (days)</Label>
                    <Input
                      type="number"
                      value={reorderInputs.leadTime}
                      onChange={(e) => setReorderInputs((prev) => ({ ...prev, leadTime: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Safety Stock (units)</Label>
                    <Input
                      type="number"
                      value={reorderInputs.safetyStock}
                      onChange={(e) => setReorderInputs((prev) => ({ ...prev, safetyStock: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Order Cost ($)</Label>
                    <Input
                      type="number"
                      value={reorderInputs.orderCost}
                      onChange={(e) => setReorderInputs((prev) => ({ ...prev, orderCost: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Holding Cost ($/unit/year)</Label>
                    <Input
                      type="number"
                      value={reorderInputs.holdingCost}
                      onChange={(e) => setReorderInputs((prev) => ({ ...prev, holdingCost: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <Button
                    onClick={calculateReorderPoint}
                    className="w-full bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Reorder Point
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-[#B6F400]" />
                  Optimal Values
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{results.reorder.reorderPoint}</div>
                    <div className="text-sm text-gray-400">Reorder Point (units)</div>
                    <div className="text-xs text-gray-500 mt-1">When to place new orders</div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{results.reorder.eoq}</div>
                    <div className="text-sm text-gray-400">Economic Order Quantity</div>
                    <div className="text-xs text-gray-500 mt-1">Optimal order size</div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      ${results.reorder.totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Annual Total Cost</div>
                    <div className="text-xs text-gray-500 mt-1">Ordering + Holding costs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ROI Calculator */}
          <TabsContent value="roi" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Investment Analysis
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Initial Investment ($)</Label>
                    <Input
                      type="number"
                      value={roiInputs.initialInvestment}
                      onChange={(e) => setRoiInputs((prev) => ({ ...prev, initialInvestment: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Annual Savings ($)</Label>
                    <Input
                      type="number"
                      value={roiInputs.annualSavings}
                      onChange={(e) => setRoiInputs((prev) => ({ ...prev, annualSavings: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Implementation Cost ($)</Label>
                    <Input
                      type="number"
                      value={roiInputs.implementationCost}
                      onChange={(e) => setRoiInputs((prev) => ({ ...prev, implementationCost: e.target.value }))}
                      className="bg-[#2C3444] border-none text-white mt-1"
                    />
                  </div>

                  <Button onClick={calculateROI} className="w-full bg-[#B6F400] text-[#0B0F1A] hover:bg-[#9ED900]">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate ROI
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-[#B6F400]" />
                  Financial Returns
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{results.roi.roi}%</div>
                    <div className="text-sm text-gray-400">3-Year ROI</div>
                    <div className="text-xs text-gray-500 mt-1">Return on Investment</div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{results.roi.paybackPeriod} years</div>
                    <div className="text-sm text-gray-400">Payback Period</div>
                    <div className="text-xs text-gray-500 mt-1">Time to recover investment</div>
                  </div>

                  <div className="bg-[#2C3444] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">${results.roi.npv.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Net Present Value</div>
                    <div className="text-xs text-gray-500 mt-1">3-year projection</div>
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
