"use client";

import { useAuth } from "@/providers/AuthProvider";
import LogoutButton from "@/components/logout";
import React, { useState } from 'react'

import { LayoutDashboard, Warehouse, Package, BarChart2, FileText, Settings, Users, Menu, X, Bell, Search, ChevronDown, LogOut, CreditCard, HelpCircle, User, Shield, Zap, Clock, AlertTriangle, DollarSign, TrendingUp, Filter, Download, QrCode, Repeat, Plus, Calendar, CheckCircle, RefreshCw, MoreHorizontal, ChevronRight, Star, Layers, Truck, Clipboard, PieChart, ArrowUpRight, ArrowDownRight,Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
    
  return (
    <div className="mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6 text-primary">Dashboard</h1> */}
      <div className="flex space-x-4">

       
      {/* User Profile Card */}
      <Card className="mb-8 bg-bg-secondary border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <User className="mr-2 h-5 w-5 text-brand-primary" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted" />
                <span className="text-primary font-medium">Name:</span>
                <span className="ml-2 text-muted">{user.name}</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted" />
                <span className="text-primary font-medium">Email:</span>
                <span className="ml-2 text-muted">{user.email}</span>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-muted" />
                <span className="text-primary font-medium">Role:</span>
                <span className="ml-2 text-muted capitalize">{user.role}</span>
              </div>
              
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-success text-primary">
                  Logged In
                </span>
              </div>
              
              <div className="mt-4">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="text-status-error">
              Not authenticated. Please log in.
            </div>
          )}
        </CardContent>
      </Card>
      </div>
      
   
    </div>
  );
}
