package com.seairhub.driver.src.main.list.deliveryinfo

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.seairhub.driver.src.main.list.deliveryinfo.models.LocationRequest
import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LocationWorker(context: Context, workerParams: WorkerParameters) : Worker(context, workerParams) {
    private val context_ = context
    lateinit var location : FusedLocationProviderClient

    override fun doWork() : Result {
        return try {
            checkDistance()
            Result.success()
        } catch (err : Exception) {
            Result.failure()
        }
    }

    private fun checkDistance() {
        try {
            location = LocationServices.getFusedLocationProviderClient(context_)
            location.lastLocation.addOnCompleteListener { it ->
                if (it.isSuccessful) {
                    it.result?.let { location_ ->
                        val lat = location_.latitude
                        val lon = location_.longitude

                        println("200 lat : $lat, lon : $lon")

                        LocationService().tryPostLocation(LocationRequest(lat, lon))
                    }
                } else {
                    println("400 fail")
                }
            }
        } catch (err : SecurityException) {
            println("500 SecurityException")
        }
    }
}