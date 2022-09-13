package com.seairhub.driver.src.main.list.deliveryinfo

import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse

interface NotificationView {
    fun onPostNotificationSuccess(response: NotificationResponse)
    fun onPostNotificationFailure(message: String)
}