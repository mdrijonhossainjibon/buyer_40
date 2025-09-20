'use client'

import { Card, Skeleton, PullToRefresh, Empty, SearchBar, Selector, Badge } from 'antd-mobile'
import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { adminWithdrawalsActions } from '@/store/modules/adminWithdrawals'
import { WithdrawalRequest, WithdrawalStatusFilter, WithdrawalMethodFilter, WithdrawalSortBy, WithdrawalSortOrder } from '@/store/modules/adminWithdrawals/types'
import WithdrawalDetailsPopup from './WithdrawalDetailsPopup'
import WithdrawalFilterPopup from './WithdrawalFilterPopup'
import { 
  SearchOutline, 
  FilterOutline, 
  CheckCircleOutline,
  CloseCircleOutline,
  ClockCircleOutline,
  DownOutline,
  UpOutline
} from 'antd-mobile-icons'

export default function AdminWithdrawals() {
  const dispatch = useDispatch()
  const {
    withdrawals,
    isLoading,
    isProcessing,
    searchQuery,
    statusFilter,
    methodFilter,
    sortBy,
    sortOrder,
    selectedWithdrawal,
    showDetailsPopup,
    error,
    totalCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalAmount,
    pendingAmount
  } = useSelector((state: RootState) => state.adminWithdrawals)

  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Fetch withdrawals on component mount
  useEffect(() => {
    dispatch(adminWithdrawalsActions.fetchWithdrawalsRequest())
    
    // Cleanup on unmount
    return () => {
      dispatch(adminWithdrawalsActions.clearError())
    }
  }, [])
  // Filter and sort withdrawals
  const filteredAndSortedWithdrawals = useMemo(() => {
    let filtered = withdrawals

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(w => 
        w.username.toLowerCase().includes(query) ||
        w.userId.toLowerCase().includes(query) ||
        w.accountNumber.toLowerCase().includes(query) ||
        w.id.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(w => w.status === statusFilter)
    }

    // Apply method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(w => w.method.toLowerCase() === methodFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'requestTime'  ) {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortBy === 'amount') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [withdrawals, searchQuery, statusFilter, methodFilter, sortBy, sortOrder])

  // Handle search
  const handleSearch = (value: string) => {
    dispatch(adminWithdrawalsActions.setSearchQuery(value))
  }

  // Handle filter changes
  const handleStatusFilter = (value: WithdrawalStatusFilter) => {
    dispatch(adminWithdrawalsActions.setStatusFilter(value))
  }

  const handleMethodFilter = (value: WithdrawalMethodFilter) => {
    dispatch(adminWithdrawalsActions.setMethodFilter(value))
  }

  const handleResetFilters = () => {
    dispatch(adminWithdrawalsActions.setStatusFilter('all'))
    dispatch(adminWithdrawalsActions.setMethodFilter('all'))
  }

  const handleApplyFilters = () => {
    // Filters are applied in real-time, this is just for UX feedback
  }

  // Handle sorting
  const handleSort = (field: WithdrawalSortBy) => {
    if (sortBy === field) {
      dispatch(adminWithdrawalsActions.setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))
    } else {
      dispatch(adminWithdrawalsActions.setSortBy(field))
      dispatch(adminWithdrawalsActions.setSortOrder('desc'))
    }
  }

  // Handle withdrawal selection
  const handleWithdrawalClick = (withdrawal: WithdrawalRequest) => {
    dispatch(adminWithdrawalsActions.setSelectedWithdrawal(withdrawal))
    dispatch(adminWithdrawalsActions.setShowDetailsPopup(true))
  }

  // Handle withdrawal actions
  const onWithdrawalAction = (withdrawalId: string, action: 'approve' | 'reject', note?: string, transactionId?: string) => {
    dispatch(adminWithdrawalsActions.processWithdrawalRequest(withdrawalId, action, note, transactionId))
  }

 

  // Handle selection
  const handleSelectWithdrawal = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAndSortedWithdrawals.map(w => w.id))
    } else {
      setSelectedIds([])
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    dispatch(adminWithdrawalsActions.fetchWithdrawalsRequest({ showToast: true }))
  }

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockCircleOutline className="text-yellow-500" />
      case 'approved': return <CheckCircleOutline className="text-green-500" />
      case 'rejected': return <CloseCircleOutline className="text-red-500" />
      default: return <ClockCircleOutline className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return 'Unknown'
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header with Statistics */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Withdrawal Management
            </h1>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Card className="!p-3 !bg-blue-50 dark:!bg-blue-900/20 !border-blue-200 dark:!border-blue-800">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalCount}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-yellow-50 dark:!bg-yellow-900/20 !border-yellow-200 dark:!border-yellow-800">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-green-50 dark:!bg-green-900/20 !border-green-200 dark:!border-green-800">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{approvedCount}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Approved</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-red-50 dark:!bg-red-900/20 !border-red-200 dark:!border-red-800">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">{rejectedCount}</div>
                  <div className="text-xs text-red-600 dark:text-red-400">Rejected</div>
                </div>
              </Card>
            </div>

            {/* Amount Statistics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="!p-3 !bg-purple-50 dark:!bg-purple-900/20 !border-purple-200 dark:!border-purple-800">
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(totalAmount)}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Total Amount</div>
                </div>
              </Card>
              
              <Card className="!p-3 !bg-orange-50 dark:!bg-orange-900/20 !border-orange-200 dark:!border-orange-800">
                <div className="text-center">
                  <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(pendingAmount)}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Pending Amount</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 space-y-3">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search by username, ID, or account..."
              value={searchQuery}
              onChange={handleSearch}
              showCancelButton
              style={{
                '--border-radius': '8px',
                '--background': 'var(--adm-color-fill-content)',
              }}
            />

            {/* Filter Button and Active Filter Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilterPopup(true)}
                  className="flex items-center px-3 py-2 text-sm border border-blue-200 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                >
                  <FilterOutline className="mr-1" />
                  Filters
                  {(statusFilter !== 'all' || methodFilter !== 'all') && (
                    <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
                
                {/* Active Filter Badges */}
                <div className="flex items-center space-x-2">
                  {statusFilter !== 'all' && (
                    <Badge
                      content={statusFilter === 'pending' ? 'Pending' : statusFilter === 'approved' ? 'Approved' : 'Rejected'}
                      style={{
                        '--right': '-8px',
                        '--top': '-8px',
                        '--color': statusFilter === 'pending' ? '#f59e0b' : statusFilter === 'approved' ? '#10b981' : '#ef4444'
                      }}
                    >
                      <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        Status: {statusFilter === 'pending' ? 'Pending' : statusFilter === 'approved' ? 'Approved' : 'Rejected'}
                      </div>
                    </Badge>
                  )}
                  
                  {methodFilter !== 'all' && (
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                      Method: {methodFilter === 'bkash' ? 'bKash' : methodFilter === 'nagad' ? 'Nagad' : methodFilter === 'rocket' ? 'Rocket' : 'Bank'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bulk Actions and Clear Filters */}
              <div className="flex items-center space-x-2">
                {/* Bulk Actions */}
                {selectedIds.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button
                        onClick={() => {
                          dispatch(adminWithdrawalsActions.bulkProcessWithdrawalsRequest(selectedIds, 'approve'))
                          setSelectedIds([])
                        }}
                        disabled={isProcessing}
                        className="flex items-center px-3 py-2 text-sm border border-green-200 dark:border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircleOutline className="mr-1" />
                        Approve
                      </button>
                      <Badge content={selectedIds.length} style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => {
                          dispatch(adminWithdrawalsActions.bulkProcessWithdrawalsRequest(selectedIds, 'reject'))
                          setSelectedIds([])
                        }}
                        disabled={isProcessing}
                        className="flex items-center px-3 py-2 text-sm border border-red-200 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CloseCircleOutline className="mr-1" />
                        Reject
                      </button>
                      <Badge content={selectedIds.length} style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
                    </div>
                  </div>
                )}
                
                {/* Clear Filters Button */}
                {(statusFilter !== 'all' || methodFilter !== 'all') && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center space-x-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredAndSortedWithdrawals.length && filteredAndSortedWithdrawals.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded"
              />
              
              <button
                onClick={() => handleSort('username')}
                className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span>User</span>
                {sortBy === 'username' && (
                  sortOrder === 'asc' ? <UpOutline className="w-3 h-3" /> : <DownOutline className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span>Amount</span>
                {sortBy === 'amount' && (
                  sortOrder === 'asc' ? <UpOutline className="w-3 h-3" /> : <DownOutline className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={() => handleSort('requestTime')}
                className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span>Time</span>
                {sortBy === 'requestTime' && (
                  sortOrder === 'asc' ? <UpOutline className="w-3 h-3" /> : <DownOutline className="w-3 h-3" />
                )}
              </button>
              
              <span>Status</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="!bg-white dark:!bg-gray-800">
                  <Skeleton.Title animated style={{ width: '60%' }} />
                  <Skeleton.Paragraph lineCount={3} animated />
                </Card>
              ))}
            </div>
          ) : filteredAndSortedWithdrawals.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Empty 
                description="No withdrawal requests found"
                imageStyle={{ height: 60 }}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedWithdrawals.map((withdrawal) => (
                <Card
                  key={withdrawal.id}
                  className="!bg-white dark:!bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleWithdrawalClick(withdrawal)}
                >
                  <div className="flex items-center space-x-4 p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(withdrawal.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleSelectWithdrawal(withdrawal.id, e.target.checked)
                      }}
                      className="rounded"
                    />
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {withdrawal.username}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        ID: {withdrawal.userId}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {withdrawal.method} • {withdrawal.accountNumber}
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(withdrawal.amount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(withdrawal.requestTime)}
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(withdrawal.status)}`}>
                        {getStatusText(withdrawal.status)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Details Popup */}
        <WithdrawalDetailsPopup
          visible={showDetailsPopup}
          withdrawal={selectedWithdrawal}
          onClose={() => dispatch(adminWithdrawalsActions.setShowDetailsPopup(false))}
          onWithdrawalAction={onWithdrawalAction}
        />
        
        {/* Filter Popup */}
        <WithdrawalFilterPopup
          visible={showFilterPopup}
          onClose={() => setShowFilterPopup(false)}
          statusFilter={statusFilter}
          methodFilter={methodFilter}
          onStatusFilterChange={handleStatusFilter}
          onMethodFilterChange={handleMethodFilter}
          onResetFilters={handleResetFilters}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </PullToRefresh>
  )
}
