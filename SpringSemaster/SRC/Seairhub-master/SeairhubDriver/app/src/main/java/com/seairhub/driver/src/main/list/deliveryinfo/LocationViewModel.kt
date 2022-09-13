package com.seairhub.driver.src.main.list.deliveryinfo

import androidx.lifecycle.ViewModel
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class LocationViewModel : ViewModel() {
    fun startWorkRequests(workManager: WorkManager) {
        workManager.cancelAllWork()

        periodicWorkRequest(1, workManager)
    }

    private fun periodicWorkRequest(period: Long, workManager: WorkManager) {
        /*주기적으로 반복하는 WorkRequest*/
        val workRequest = PeriodicWorkRequestBuilder<LocationWorker>(period, TimeUnit.MINUTES).build()
        workManager.enqueueUniquePeriodicWork(
            "CHECK_GPS",
            ExistingPeriodicWorkPolicy.REPLACE,
            workRequest
        )
    }
}