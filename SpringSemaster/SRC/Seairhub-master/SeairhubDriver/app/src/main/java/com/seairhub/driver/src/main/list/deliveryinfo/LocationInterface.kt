package com.seairhub.driver.src.main.list.deliveryinfo

import com.seairhub.driver.src.main.list.deliveryinfo.models.LocationRequest
import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface LocationInterface {
    @POST("/send-location")
    fun postLocation(
        @Body params : LocationRequest
    ) : Call<NotificationResponse>
}