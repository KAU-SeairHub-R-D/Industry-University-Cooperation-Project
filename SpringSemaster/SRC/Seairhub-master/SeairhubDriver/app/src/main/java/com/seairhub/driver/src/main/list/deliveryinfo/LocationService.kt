package com.seairhub.driver.src.main.list.deliveryinfo

import com.seairhub.driver.config.ApplicationClass
import com.seairhub.driver.src.main.list.deliveryinfo.models.LocationRequest
import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LocationService() {
    fun tryPostLocation(locationRequest: LocationRequest) {
        val locationInterface = ApplicationClass.sRetrofit.create(LocationInterface::class.java)

        locationInterface.postLocation(
            locationRequest
        ).enqueue(object : Callback<NotificationResponse> {
            override fun onResponse(
                call: Call<NotificationResponse>,
                response: Response<NotificationResponse>
            ) {
                println(response.body() as NotificationResponse)
            }

            override fun onFailure(call: Call<NotificationResponse>, t: Throwable) {
                println(t.message ?: "통신 오류")
            }
        })
    }
}