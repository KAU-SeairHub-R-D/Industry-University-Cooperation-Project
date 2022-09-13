package com.seairhub.driver.src.main.list.deliveryinfo

import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationRequest
import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface NotificationInterface {
    @POST("/send-message")
    fun postNotification(
        @Body params : NotificationRequest
    ) : Call<NotificationResponse>
}