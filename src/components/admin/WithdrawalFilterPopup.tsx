'use client'

import { Popup, Selector, Divider } from 'antd-mobile'
import { FilterOutline, CloseOutline, CheckOutline, UndoOutline } from 'antd-mobile-icons'
import { WithdrawalStatusFilter, WithdrawalMethodFilter } from '@/store/modules/adminWithdrawals/types'

interface WithdrawalFilterPopupProps {
  visible: boolean
  onClose: () => void
  statusFilter: WithdrawalStatusFilter
  methodFilter: WithdrawalMethodFilter
  onStatusFilterChange: (value: WithdrawalStatusFilter) => void
  onMethodFilterChange: (value: WithdrawalMethodFilter) => void
  onResetFilters: () => void
  onApplyFilters: () => void
}

export default function WithdrawalFilterPopup({
  visible,
  onClose,
  statusFilter,
  methodFilter,
  onStatusFilterChange,
  onMethodFilterChange,
  onResetFilters,
  onApplyFilters
}: WithdrawalFilterPopupProps) {
  
  const statusOptions = [
    { label: 'All Status', value: 'all' as WithdrawalStatusFilter },
    { label: 'Pending', value: 'pending' as WithdrawalStatusFilter },
    { label: 'Approved', value: 'approved' as WithdrawalStatusFilter },
    { label: 'Rejected', value: 'rejected' as WithdrawalStatusFilter }
  ]

  const methodOptions = [
    { label: 'All Methods', value: 'all' as WithdrawalMethodFilter },
    { label: 'bKash', value: 'bkash' as WithdrawalMethodFilter },
    { label: 'Nagad', value: 'nagad' as WithdrawalMethodFilter },
   
  ]

  const handleStatusChange = (values: WithdrawalStatusFilter[]) => {
    onStatusFilterChange(values[0] || 'all')
  }

  const handleMethodChange = (values: WithdrawalMethodFilter[]) => {
    onMethodFilterChange(values[0] || 'all')
  }

  const handleApply = () => {
    onApplyFilters()
    onClose()
  }

  const handleReset = () => {
    onResetFilters()
  }

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== 'all' || methodFilter !== 'all'

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="bottom"
      bodyStyle={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        minHeight: '40vh',
        maxHeight: '80vh',
        backgroundColor: 'var(--adm-color-background)',
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FilterOutline className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Filter Withdrawals
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <CloseOutline />
          </button>
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Active filters applied
              </span>
            </div>
          </div>
        )}

        {/* Filter Options */}
        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Status Filter
              </h3>
              {statusFilter !== 'all' && (
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  {statusOptions.find(opt => opt.value === statusFilter)?.label}
                </div>
              )}
            </div>
            <Selector
              options={statusOptions}
              value={[statusFilter]}
              onChange={handleStatusChange}
              style={{
                '--border-radius': '8px',
              } as any}
            />
          </div>

          <Divider />

          {/* Method Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Payment Method
              </h3>
              {methodFilter !== 'all' && (
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                  {methodOptions.find(opt => opt.value === methodFilter)?.label}
                </div>
              )}
            </div>
            <Selector
              options={methodOptions}
              value={[methodFilter]}
              onChange={handleMethodChange}
              style={{
                '--border-radius': '8px',
              } as any}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
            >
              <CheckOutline className="mr-2" />
              Apply Filters
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                <UndoOutline className="mr-2" />
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            {hasActiveFilters ? (
              <>
                Filtering by: {statusFilter !== 'all' && `Status (${statusOptions.find(opt => opt.value === statusFilter)?.label})`}
                {statusFilter !== 'all' && methodFilter !== 'all' && ', '}
                {methodFilter !== 'all' && `Method (${methodOptions.find(opt => opt.value === methodFilter)?.label})`}
              </>
            ) : (
              'No filters applied - showing all withdrawals'
            )}
          </div>
        </div>
      </div>
    </Popup>
  )
}
