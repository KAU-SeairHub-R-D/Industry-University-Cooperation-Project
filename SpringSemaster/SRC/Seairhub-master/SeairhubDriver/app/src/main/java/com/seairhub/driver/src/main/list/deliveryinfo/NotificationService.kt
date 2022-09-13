package com.seairhub.driver.src.main.list.deliveryinfo

import com.seairhub.driver.config.ApplicationClass
import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationRequest
import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class NotificationService(val view: DeliveryInfoFragment) {
    fun tryPostNotification(notificationRequest: NotificationRequest) {
        val notificationInterface = ApplicationClass.sRetrofit.create(NotificationInterface::class.java)

        notificationInterface.postNotification(
            notificationRequest
        ).enqueue(object : Callback<NotificationResponse> {
            override fun onResponse(
                call: Call<NotificationResponse>,
                response: Response<NotificationResponse>
            ) {
                view.onPostNotificationSuccess(response.body() as NotificationResponse)
            }

            override fun onFailure(call: Call<NotificationResponse>, t: Throwable) {
                view.onPostNotificationFailure(t.message ?: "통신 오류")
            }
        })
    }
}