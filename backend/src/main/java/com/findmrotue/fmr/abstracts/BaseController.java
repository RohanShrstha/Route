package com.findmrotue.fmr.abstracts;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.findmrotue.fmr.config.CustomMessageSource;
import com.findmrotue.fmr.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;

public class BaseController {
    @Autowired
    private CustomMessageSource customMessageSource;
    @Autowired
    private ObjectMapper objectMapper;

    protected ApiResponse successResponse(String message, Object data) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(true);
        apiResponse.setMessage(message);
        apiResponse.setData(data);
        return apiResponse;
    }

    protected ApiResponse errorResponse(String message, Object errors) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatus(false);
        apiResponse.setMessage(message);
        apiResponse.setData(errors);
        return apiResponse;
    }
}


